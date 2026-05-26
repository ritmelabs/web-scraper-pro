REVOKE EXECUTE ON FUNCTION public.get_today_scrape_count(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_tier(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_today_scrape_count(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_tier(uuid) TO service_role;