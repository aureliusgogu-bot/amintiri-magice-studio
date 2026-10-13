-- Star rating (1-5) chosen by the visitor; default 5 for existing rows
ALTER TABLE public.reviews ADD COLUMN rating smallint NOT NULL DEFAULT 5;
ALTER TABLE public.review_submissions ADD COLUMN rating smallint NOT NULL DEFAULT 5;

COMMENT ON COLUMN public.reviews.rating IS 'Star rating (1-5) chosen by the visitor';
COMMENT ON COLUMN public.review_submissions.rating IS 'Star rating (1-5) chosen by the visitor';

CREATE OR REPLACE FUNCTION public.submit_visitor_review(
  p_author text,
  p_quote text,
  p_event text DEFAULT ''::text,
  p_rating smallint DEFAULT 5::smallint
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE submission_id uuid;
BEGIN
  IF p_author IS NULL OR char_length(btrim(p_author)) NOT BETWEEN 2 AND 80
    OR p_quote IS NULL OR char_length(btrim(p_quote)) NOT BETWEEN 10 AND 1200
    OR p_event IS NULL OR char_length(p_event) > 60
    OR p_rating IS NULL OR p_rating NOT BETWEEN 1 AND 5 THEN
    RAISE EXCEPTION 'Recenzia nu este validă.';
  END IF;
  INSERT INTO public.review_submissions(author, quote, event, rating)
  VALUES (btrim(p_author), btrim(p_quote), btrim(p_event), p_rating)
  RETURNING id INTO submission_id;
  RETURN submission_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.approve_visitor_review(p_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE submission public.review_submissions%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Acces interzis.'; END IF;
  SELECT * INTO submission FROM public.review_submissions WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Recenzia nu mai este în așteptare.'; END IF;
  INSERT INTO public.reviews(quote, author, event, rating, sort_order)
    VALUES (submission.quote, submission.author, submission.event, submission.rating,
      (SELECT coalesce(min(sort_order), 0) - 1 FROM public.reviews));
  DELETE FROM public.review_submissions WHERE id = p_id;
END;
$function$;