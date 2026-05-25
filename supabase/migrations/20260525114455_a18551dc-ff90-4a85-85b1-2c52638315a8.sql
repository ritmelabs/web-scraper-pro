
-- AI analyses table
CREATE TABLE public.ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.scrape_jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  result JSONB NOT NULL,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_analyses_job ON public.ai_analyses(job_id);
CREATE INDEX idx_ai_analyses_user ON public.ai_analyses(user_id, created_at DESC);
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own analyses" ON public.ai_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own analyses" ON public.ai_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own analyses" ON public.ai_analyses FOR DELETE USING (auth.uid() = user_id);

-- Subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro', 'business', 'enterprise');

-- Subscriptions table
CREATE TABLE public.subscriptions (
  user_id UUID PRIMARY KEY,
  tier public.subscription_tier NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Security definer function to get tier (defaults to 'free')
CREATE OR REPLACE FUNCTION public.get_user_tier(_user_id UUID)
RETURNS public.subscription_tier
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT tier FROM public.subscriptions
     WHERE user_id = _user_id
       AND status = 'active'
       AND (current_period_end IS NULL OR current_period_end > now())
     LIMIT 1),
    'free'::public.subscription_tier
  );
$$;

-- Daily quota helper
CREATE OR REPLACE FUNCTION public.get_today_scrape_count(_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*)::INTEGER FROM public.scrape_jobs
  WHERE user_id = _user_id AND created_at >= date_trunc('day', now());
$$;
