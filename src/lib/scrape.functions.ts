import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as cheerio from "cheerio";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const MAX_RESOURCES = 500;
const FETCH_TIMEOUT = 15000;

type RType =
  | "html" | "css" | "js" | "image" | "font" | "video" | "audio"
  | "document" | "manifest" | "favicon" | "other";

function classify(url: string, contentType?: string): RType {
  const u = url.toLowerCase().split("?")[0].split("#")[0];
  const ext = u.split(".").pop() || "";
  if (["css"].includes(ext)) return "css";
  if (["js", "mjs", "cjs"].includes(ext)) return "js";
  if (["png", "jpg", "jpeg", "gif", "svg", "webp", "avif", "bmp"].includes(ext)) return "image";
  if (["ico"].includes(ext)) return "favicon";
  if (["woff", "woff2", "ttf", "otf", "eot"].includes(ext)) return "font";
  if (["mp4", "webm", "mov", "m4v"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a", "flac"].includes(ext)) return "audio";
  if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "json", "xml", "txt", "md"].includes(ext)) return "document";
  if (u.endsWith("manifest.json") || u.endsWith(".webmanifest")) return "manifest";
  if (u.endsWith(".html") || u.endsWith(".htm") || u.endsWith("/")) return "html";
  if (contentType) {
    if (contentType.includes("css")) return "css";
    if (contentType.includes("javascript")) return "js";
    if (contentType.startsWith("image/")) return "image";
    if (contentType.startsWith("video/")) return "video";
    if (contentType.startsWith("audio/")) return "audio";
    if (contentType.startsWith("font/") || contentType.includes("font")) return "font";
    if (contentType.includes("html")) return "html";
    if (contentType.includes("pdf") || contentType.includes("msword") || contentType.includes("sheet")) return "document";
  }
  return "other";
}

function filenameFrom(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.split("/").filter(Boolean);
    const last = path[path.length - 1];
    return last && last.includes(".") ? last : (last || u.hostname) + ".html";
  } catch {
    return "resource";
  }
}

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, headers: { "user-agent": "SiteHarvestBot/1.0", ...(init?.headers || {}) } });
  } finally { clearTimeout(t); }
}

function extractUrls(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const urls = new Set<string>();
  const push = (u?: string | null) => {
    if (!u) return;
    const v = u.trim();
    if (!v || v.startsWith("data:") || v.startsWith("javascript:") || v.startsWith("mailto:") || v.startsWith("tel:")) return;
    try { urls.add(new URL(v, baseUrl).toString()); } catch { /* ignore */ }
  };
  $("link[href]").each((_, el) => push($(el).attr("href")));
  $("script[src]").each((_, el) => push($(el).attr("src")));
  $("img[src]").each((_, el) => push($(el).attr("src")));
  $("img[srcset], source[srcset]").each((_, el) => {
    const ss = $(el).attr("srcset") || "";
    ss.split(",").forEach((part) => push(part.trim().split(/\s+/)[0]));
  });
  $("source[src]").each((_, el) => push($(el).attr("src")));
  $("video[src], audio[src], video[poster]").each((_, el) => {
    push($(el).attr("src")); push($(el).attr("poster"));
  });
  $("iframe[src], embed[src]").each((_, el) => push($(el).attr("src")));
  $("a[href]").each((_, el) => {
    const h = $(el).attr("href") || "";
    if (/\.(pdf|docx?|xlsx?|pptx?|csv|json|xml|zip)$/i.test(h)) push(h);
  });
  // CSS url(...)
  $("style").each((_, el) => {
    const css = $(el).html() || "";
    [...css.matchAll(/url\(([^)]+)\)/g)].forEach((m) => push(m[1].replace(/['"]/g, "")));
  });
  return [...urls];
}

async function performScrape(targetUrl: string, limit = MAX_RESOURCES) {
  const target = new URL(targetUrl);
  const rootRes = await fetchWithTimeout(target.toString());
  if (!rootRes.ok) throw new Error(`Site returned ${rootRes.status}`);
  const rootHtml = await rootRes.text();
  const rootCT = rootRes.headers.get("content-type") || "text/html";

  const resourceMap = new Map<string, { type: RType; filename: string; source_url: string; size: number; content_type: string | null }>();
  resourceMap.set(target.toString(), {
    type: "html",
    filename: "index.html",
    source_url: target.toString(),
    size: new Blob([rootHtml]).size,
    content_type: rootCT,
  });
  const extras = [
    new URL("/robots.txt", target).toString(),
    new URL("/sitemap.xml", target).toString(),
    new URL("/favicon.ico", target).toString(),
  ];
  const discovered = extractUrls(rootHtml, target.toString());
  const all = [...new Set([...discovered, ...extras])].slice(0, limit);
  const BATCH = 12;
  for (let i = 0; i < all.length; i += BATCH) {
    const slice = all.slice(i, i + BATCH);
    await Promise.all(slice.map(async (u) => {
      try {
        const res = await fetchWithTimeout(u, { method: "GET" });
        if (!res.ok) return;
        const ct = res.headers.get("content-type") || undefined;
        const len = Number(res.headers.get("content-length") || 0);
        let size = len;
        if (!size) {
          const buf = await res.arrayBuffer();
          size = buf.byteLength;
        }
        resourceMap.set(u, {
          type: classify(u, ct),
          filename: filenameFrom(u),
          source_url: u,
          size,
          content_type: ct ?? null,
        });
      } catch { /* skip */ }
    }));
  }
  const resources = [...resourceMap.values()];
  const totalSize = resources.reduce((s, r) => s + r.size, 0);
  return { resources, totalSize };
}

export const scrapePublic = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ url: z.string().url() }).parse(input))
  .handler(async ({ data }) => {
    const { resources, totalSize } = await performScrape(data.url, 100);
    // Guest watermark: cap exposed resources
    return { resources: resources.slice(0, 50), totalSize, watermarked: true };
  });

export const startScrape = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ url: z.string().url() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    let target: URL;
    try { target = new URL(data.url); } catch { throw new Error("Invalid URL"); }

    // Create job
    const { data: job, error: jobErr } = await supabase
      .from("scrape_jobs")
      .insert({ user_id: userId, url: target.toString(), status: "running" })
      .select().single();
    if (jobErr || !job) throw new Error(jobErr?.message || "Failed to create job");

    try {
      // Fetch root HTML
      const rootRes = await fetchWithTimeout(target.toString());
      if (!rootRes.ok) throw new Error(`Site returned ${rootRes.status}`);
      const rootHtml = await rootRes.text();
      const rootCT = rootRes.headers.get("content-type") || "text/html";

      const resourceMap = new Map<string, { type: RType; filename: string; source_url: string; size: number; content_type: string | null }>();
      resourceMap.set(target.toString(), {
        type: "html",
        filename: "index.html",
        source_url: target.toString(),
        size: new Blob([rootHtml]).size,
        content_type: rootCT,
      });

      // Try sitemap, robots, favicon
      const extras = [
        new URL("/robots.txt", target).toString(),
        new URL("/sitemap.xml", target).toString(),
        new URL("/favicon.ico", target).toString(),
      ];

      const discovered = extractUrls(rootHtml, target.toString());
      const all = [...new Set([...discovered, ...extras])].slice(0, MAX_RESOURCES);

      // HEAD-fetch in parallel batches to get size/type
      const BATCH = 12;
      for (let i = 0; i < all.length; i += BATCH) {
        const slice = all.slice(i, i + BATCH);
        await Promise.all(slice.map(async (u) => {
          try {
            const res = await fetchWithTimeout(u, { method: "GET" });
            if (!res.ok) return;
            const ct = res.headers.get("content-type") || undefined;
            const len = Number(res.headers.get("content-length") || 0);
            let size = len;
            if (!size) {
              const buf = await res.arrayBuffer();
              size = buf.byteLength;
            }
            resourceMap.set(u, {
              type: classify(u, ct),
              filename: filenameFrom(u),
              source_url: u,
              size,
              content_type: ct ?? null,
            });
          } catch { /* skip */ }
        }));
      }

      const resources = [...resourceMap.values()];
      const totalSize = resources.reduce((s, r) => s + r.size, 0);

      // Insert resources
      if (resources.length) {
        const rows = resources.map((r) => ({ ...r, job_id: job.id, user_id: userId }));
        const { error: rErr } = await supabase.from("scrape_resources").insert(rows);
        if (rErr) throw new Error(rErr.message);
      }

      await supabase.from("scrape_jobs").update({
        status: "completed",
        resource_count: resources.length,
        total_size: totalSize,
        completed_at: new Date().toISOString(),
      }).eq("id", job.id);

      return { jobId: job.id, count: resources.length, totalSize };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Scrape failed";
      await supabase.from("scrape_jobs").update({ status: "failed", error: msg, completed_at: new Date().toISOString() }).eq("id", job.id);
      throw new Error(msg);
    }
  });

export const getJob = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ jobId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [{ data: job }, { data: resources }] = await Promise.all([
      supabase.from("scrape_jobs").select("*").eq("id", data.jobId).single(),
      supabase.from("scrape_resources").select("*").eq("job_id", data.jobId).order("type"),
    ]);
    return { job, resources: resources ?? [] };
  });

export const listJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("scrape_jobs").select("*").order("created_at", { ascending: false }).limit(50);
    return data ?? [];
  });
