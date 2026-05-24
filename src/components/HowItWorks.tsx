import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GUIDE = `
## Welcome to SiteHarvest 👋

SiteHarvest is an **AI-powered web intelligence platform** that turns any
public webpage into structured, downloadable data.

### What we extract

- 🌐 **HTML & metadata** — titles, descriptions, OpenGraph, schema.org
- 🖼️ **Images & media** — all \`<img>\`, \`<video>\`, and OG images
- 🎨 **Styles & scripts** — every linked CSS and JS asset
- 🔤 **Fonts** — webfonts referenced in stylesheets
- 📄 **Documents** — PDFs, docs, and downloadable files
- 📧 **Contacts** — emails and social handles discovered on the page

### How to use this tool

1. Paste any **public URL** (\`https://...\`) into the field above.
2. Click **Scrape** — we fetch the page, parse the DOM, and inventory every asset.
3. Review the resource table and **image gallery** below.
4. Sign up for a free account to **download as ZIP**, **export JSON/CSV**,
   or run **AI analysis** (summary, keywords, SEO score) on the content.

### Good to know

> ⚖️  Only scrape sites you have permission to access. SiteHarvest respects
> \`robots.txt\` and rate-limits every request.

> 🔒  Guest scans are **watermarked** and capped at **50 resources** per job.
> Authenticated users get full exports, history, and unlimited resources.

### Pro tips

- Start with the **homepage** of a site — it usually links to the richest assets.
- For SPAs (React/Vue apps), try the **deep crawl** mode after signing in.
- Combine with our **AI Summarizer** to get an executive brief in one click.
`;

export function HowItWorks() {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold">How SiteHarvest works</div>
            <div className="text-xs text-muted-foreground">A 30-second guide to the scraper</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="hidden sm:inline-flex">Markdown guide</Badge>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-border bg-background/60 px-6 py-6">
          <article
            className="prose prose-sm max-w-none
              prose-headings:font-semibold prose-headings:text-foreground
              prose-h2:mt-0 prose-h2:text-xl
              prose-h3:text-base prose-h3:mt-6
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-li:text-muted-foreground prose-li:my-0.5
              prose-strong:text-foreground
              prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-foreground/80
              prose-ol:text-muted-foreground prose-ol:my-3"
          >
            <ReactMarkdown>{GUIDE}</ReactMarkdown>
          </article>
        </div>
      )}
    </div>
  );
}
