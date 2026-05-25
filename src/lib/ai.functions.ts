import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText, Output } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { TIER_LIMITS, type Tier } from "./tier";

const ANALYSIS_TYPES = ["summary", "seo", "keywords", "categorization", "tech_stack"] as const;
type AnalysisType = (typeof ANALYSIS_TYPES)[number];

const SCHEMAS: Record<AnalysisType, z.ZodTypeAny> = {
  summary: z.object({
    headline: z.string(),
    description: z.string(),
    purpose: z.string(),
    target_audience: z.string(),
  }),
  seo: z.object({
    score: z.number().min(0).max(100),
    title_quality: z.string(),
    meta_description_quality: z.string(),
    heading_structure: z.string(),
    recommendations: z.array(z.string()),
  }),
  keywords: z.object({
    primary: z.array(z.string()),
    secondary: z.array(z.string()),
    entities: z.array(z.string()),
  }),
  categorization: z.object({
    industry: z.string(),
    niche: z.string(),
    content_type: z.string(),
    tone: z.string(),
    languages: z.array(z.string()),
  }),
  tech_stack: z.object({
    frameworks: z.array(z.string()),
    libraries: z.array(z.string()),
    analytics: z.array(z.string()),
    cms: z.string().nullable(),
    confidence: z.enum(["low", "medium", "high"]),
  }),
};

const PROMPTS: Record<AnalysisType, string> = {
  summary: "Produce a concise summary of what this website is and does. Identify its core purpose and target audience.",
  seo: "Analyze the SEO health of this page. Score 0-100. Review title, meta description, heading structure. Give concrete recommendations.",
  keywords: "Extract the top primary keywords, secondary keywords, and named entities (brands, products, people, places) from this page.",
  categorization: "Categorize this website. Industry, niche, content type (blog, ecommerce, saas, portfolio, news, etc.), tone, and languages detected.",
  tech_stack: "Based on the resource URLs (JS/CSS files, CDNs, vendor patterns), infer the tech stack. List frameworks, libraries, analytics tools, CMS.",
};

async function getTier(supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>, userId: string): Promise<Tier> {
  const { data } = await supabase
    .from("subscriptions")
    .select("tier,status,current_period_end")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return "free";
  const active = data.status === "active" && (!data.current_period_end || new Date(data.current_period_end as string) > new Date());
  return active ? (data.tier as Tier) : "free";
}

export const runAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      jobId: z.string().uuid(),
      type: z.enum(ANALYSIS_TYPES),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Load job + resources
    const { data: job } = await supabase.from("scrape_jobs").select("*").eq("id", data.jobId).single();
    if (!job) throw new Error("Job not found");
    const { data: resources } = await supabase
      .from("scrape_resources")
      .select("type,filename,source_url,size,content_type")
      .eq("job_id", data.jobId)
      .limit(200);

    // Tier gating: free users get 1 lifetime AI analysis as a teaser
    const tier = await getTier(supabase as never, userId);
    if (!TIER_LIMITS[tier].aiEnabled) {
      const { count } = await supabase
        .from("ai_analyses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      if ((count ?? 0) >= 1) {
        throw new Error("AI Studio requires the Pro plan. Upgrade to unlock unlimited AI analyses.");
      }
    }

    // Reuse cached analysis if present
    const { data: existing } = await supabase
      .from("ai_analyses")
      .select("*")
      .eq("job_id", data.jobId)
      .eq("type", data.type)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing) return existing;

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI gateway is not configured");

    // Build compact context for the model
    const rootHtmlRes = job.url
      ? await fetch(job.url, { headers: { "user-agent": "SiteHarvestBot/1.0" } }).catch(() => null)
      : null;
    let pageText = "";
    if (rootHtmlRes && rootHtmlRes.ok) {
      const html = await rootHtmlRes.text();
      pageText = html.replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .slice(0, 6000);
    }

    const resourceSummary = (resources ?? []).slice(0, 60)
      .map((r) => `${r.type}: ${r.source_url}`).join("\n");

    const prompt = `URL: ${job.url}\n\nPage content (truncated):\n${pageText}\n\nResource list (truncated):\n${resourceSummary}\n\nTask: ${PROMPTS[data.type as AnalysisType]}`;

    const model = createLovableAiGatewayProvider(key)("google/gemini-3-flash-preview");
    let result: unknown;
    try {
      const { experimental_output } = await generateText({
        model,
        output: Output.object({ schema: SCHEMAS[data.type as AnalysisType] }),
        prompt,
        system: "You are a senior web intelligence analyst. Return only the requested structured data. Be specific and actionable.",
      });
      result = experimental_output;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI request failed";
      if (msg.includes("429")) throw new Error("AI rate limit reached. Please try again in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted for this workspace. Add credits to continue.");
      throw new Error(msg);
    }

    const { data: saved, error } = await supabase
      .from("ai_analyses")
      .insert({
        job_id: data.jobId,
        user_id: userId,
        type: data.type,
        result: result as object,
        model: "google/gemini-3-flash-preview",
      })
      .select().single();
    if (error) throw new Error(error.message);
    return saved;
  });

export const listAnalyses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ jobId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows } = await context.supabase
      .from("ai_analyses")
      .select("*")
      .eq("job_id", data.jobId)
      .order("created_at", { ascending: false });
    return rows ?? [];
  });
