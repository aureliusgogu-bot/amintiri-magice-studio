CREATE TABLE public.admin_emails (
  email text PRIMARY KEY CHECK (email = lower(email)),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, auth AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    JOIN public.admin_emails a ON a.email = lower(u.email)
    WHERE u.id = auth.uid()
      AND u.email_confirmed_at IS NOT NULL
      AND lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

GRANT SELECT, INSERT, DELETE ON public.admin_emails TO authenticated;
GRANT ALL ON public.admin_emails TO service_role;
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read admin emails" ON public.admin_emails FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins add admin emails" ON public.admin_emails FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins remove admin emails" ON public.admin_emails FOR DELETE TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.keep_last_admin()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF (SELECT count(*) FROM public.admin_emails) <= 1 THEN
    RAISE EXCEPTION 'Nu poți șterge ultimul administrator.';
  END IF;
  RETURN OLD;
END $$;
CREATE TRIGGER admin_emails_keep_last BEFORE DELETE ON public.admin_emails
FOR EACH ROW EXECUTE FUNCTION public.keep_last_admin();

INSERT INTO public.admin_emails (email) VALUES ('facemceneplace@gmail.com');

CREATE TABLE public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Nunți',
  small_path text NOT NULL,
  large_path text NOT NULL,
  aspect_ratio numeric NOT NULL DEFAULT 0.67,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photos TO authenticated;
GRANT ALL ON public.photos TO service_role;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read photos" ON public.photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins insert photos" ON public.photos FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins update photos" ON public.photos FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete photos" ON public.photos FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX photos_sort_idx ON public.photos (sort_order);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text NOT NULL,
  event text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins update reviews" ON public.reviews FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.is_admin());

CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  people jsonb NOT NULL DEFAULT '[]'::jsonb,
  email text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  location_hero text NOT NULL DEFAULT '',
  location_contact text NOT NULL DEFAULT ''
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.site_settings (id, people, email, facebook_url, instagram_url, location_hero, location_contact) VALUES (
  1,
  '[{"name":"George Constantin","phone":"0727113893"},{"name":"Petrișor Stan","phone":"0720179744"}]'::jsonb,
  'facemceneplace@gmail.com',
  'https://www.facebook.com/share/1BagDkJcXJ/',
  'https://www.instagram.com/george.constantin1701',
  'Ilfov · În toată țara',
  'Sediul în Ilfov · Ne deplasăm în toată țara'
);

CREATE POLICY "portfolio public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio');
CREATE POLICY "portfolio admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());
CREATE POLICY "portfolio admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio' AND public.is_admin()) WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());
CREATE POLICY "portfolio admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio' AND public.is_admin());