CREATE TABLE public.review_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL CHECK (char_length(btrim(quote)) BETWEEN 10 AND 1200),
  author text NOT NULL CHECK (char_length(btrim(author)) BETWEEN 2 AND 80),
  event text NOT NULL DEFAULT '' CHECK (char_length(event) <= 60),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.review_submissions TO authenticated;
GRANT ALL ON public.review_submissions TO service_role;
ALTER TABLE public.review_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read submitted reviews" ON public.review_submissions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins reject submitted reviews" ON public.review_submissions FOR DELETE TO authenticated USING (public.is_admin());

CREATE FUNCTION public.submit_visitor_review(p_author text, p_quote text, p_event text DEFAULT '') RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE submission_id uuid;
BEGIN
  IF p_author IS NULL OR char_length(btrim(p_author)) NOT BETWEEN 2 AND 80
    OR p_quote IS NULL OR char_length(btrim(p_quote)) NOT BETWEEN 10 AND 1200
    OR p_event IS NULL OR char_length(p_event) > 60 THEN
    RAISE EXCEPTION 'Recenzia nu este validă.';
  END IF;
  INSERT INTO public.review_submissions(author, quote, event)
  VALUES (btrim(p_author), btrim(p_quote), btrim(p_event)) RETURNING id INTO submission_id;
  RETURN submission_id;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_visitor_review(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_visitor_review(text, text, text) TO anon, authenticated;

CREATE FUNCTION public.approve_visitor_review(p_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE submission public.review_submissions%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Acces interzis.'; END IF;
  SELECT * INTO submission FROM public.review_submissions WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Recenzia nu mai este în așteptare.'; END IF;
  INSERT INTO public.reviews(quote, author, event, sort_order)
    VALUES (submission.quote, submission.author, submission.event,
      (SELECT coalesce(min(sort_order), 0) - 1 FROM public.reviews));
  DELETE FROM public.review_submissions WHERE id = p_id;
END;
$$;
REVOKE ALL ON FUNCTION public.approve_visitor_review(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_visitor_review(uuid) TO authenticated;