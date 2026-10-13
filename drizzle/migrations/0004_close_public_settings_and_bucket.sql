DROP POLICY IF EXISTS "public read settings" ON public.site_settings;
CREATE POLICY "admins read settings" ON public.site_settings FOR SELECT TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.get_public_site_settings()
RETURNS TABLE(people jsonb, email text, facebook_url text, instagram_url text, location_hero text, location_contact text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT people, email, facebook_url, instagram_url, location_hero, location_contact FROM public.site_settings WHERE id = 1
$$;
REVOKE ALL ON FUNCTION public.get_public_site_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_site_settings() TO anon, authenticated;

DROP POLICY IF EXISTS "portfolio public read" ON storage.objects;
CREATE POLICY "portfolio admin read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'portfolio' AND public.is_admin());