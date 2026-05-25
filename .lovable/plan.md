# /app Premium Features + AI + Subscriptions

Transform `/app` into a full SaaS dashboard with AI-powered scraping intelligence, a daily quota (10 scrapes/day free), and paid subscription tiers starting at $15/mo.

## Scope (phased)

### Phase 1 — Dashboard shell + Quota system (free tier foundation)
- Convert `AppShell` to a sidebar layout matching landing site style: logo, nav (Dashboard, Scrape, AI Studio, History, Billing), user menu, upgrade CTA.
- New `/app` dashboard home: stats (scrapes today, this month, total resources, AI credits), recent jobs, quota progress bar, upgrade card.
- Quota enforcement: server-side check in `startScrape` — count today's jobs for user, reject if free user >= 10, return clear error.
- Move scrape form to `/app/scrape`.

### Phase 2 — AI Studio (gated premium)
New route `/app/ai/$jobId` with Lovable AI Gateway (`google/gemini-3-flash-preview`) server functions:
- **Summary** — TL;DR of site content + purpose
- **SEO Analysis** — title/meta/heading audit, keyword density, recommendations
- **Keyword Extraction** — top entities/topics
- **Content Categorization** — niche, audience, tone
- **Tech Stack Detection** — from JS/CSS resource patterns
Results stored in new `ai_analyses` table. Free users see locked cards with "Upgrade to unlock". 1 free AI run per account as teaser.

### Phase 3 — Billing & subscription tiers
Pricing page `/app/billing` + public `/pricing`:
- **Free** — 10 scrapes/day, no AI
- **Pro $15/mo** — 200 scrapes/day, all AI features, priority queue
- **Business $49/mo** — 1000 scrapes/day, bulk export, API access
- **Enterprise** — contact sales (mailto)

Subscriptions table tracks tier + period. Quota function reads tier to set limit.

## Payment provider

Digital SaaS product → recommend **Lovable's built-in Stripe Payments** (no account needed, instant test mode, handles tax). I'll run `recommend_payment_provider` to confirm fit before enabling.

## Database changes

```sql
-- daily quota helper (counts scrape_jobs per user per day)
-- ai_analyses (job_id, user_id, type, result jsonb, created_at)
-- subscriptions (user_id, tier, status, current_period_end, stripe_customer_id, stripe_subscription_id)
-- has_role pattern for tier checks via SECURITY DEFINER function get_user_tier(uuid)
```

## Technical details

- AI calls via `createServerFn` reading `LOVABLE_API_KEY` from `process.env` (already set).
- Quota check uses `requireSupabaseAuth` middleware + count query against `scrape_jobs`.
- Sidebar uses existing `components/ui/sidebar.tsx`.
- All routes under `_authenticated` layout for SSR-safe gating (will create the layout file and move existing app routes into it).
- Real implementations only — no fake loading or placeholder buttons.

## Build order

I'll build **Phase 1 → 2 → 3** in sequence in this same turn, asking for Stripe enable confirmation when Phase 3 starts (since that needs your input on the Stripe form).

Approve to proceed.