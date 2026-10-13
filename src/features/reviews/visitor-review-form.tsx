import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitVisitorReview } from "@/lib/review-submissions.functions";
import { visitorReviewSchema } from "@/lib/review-schema";

const RATING_VALUES = [1, 2, 3, 4, 5] as const;

export function VisitorReviewForm() {
  const send = useServerFn(submitVisitorReview);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const parsed = visitorReviewSchema.safeParse({
      ...Object.fromEntries(form),
      rating,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Verifică datele completate.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await send({ data: parsed.data });
      if (!result.ok) throw new Error("submission");
      setSent(true);
    } catch {
      setError("Recenzia nu a fost trimisă. Verifică internetul și încearcă din nou.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mt-12 max-w-2xl border-t border-border pt-8">
      <h3 className="font-display text-3xl">Povestește-ne experiența ta</h3>
      {sent ? (
        <p role="status" className="mt-4 text-primary">
          Mulțumim! Recenzia ta a fost trimisă și va apărea pe site după aprobare.
        </p>
      ) : (
        <form className="contact-form mt-6" onSubmit={submit} aria-label="Scrie o recenzie">
          <div className="form-row">
            <label>
              Numele tău
              <input name="author" autoComplete="name" required minLength={2} maxLength={80} />
            </label>
            <label>
              Evenimentul (opțional)
              <input name="event" placeholder="Nuntă, botez, cununie…" maxLength={60} />
            </label>
          </div>
          <fieldset className="border-0 p-0">
            <legend className="text-sm text-muted-foreground">Nota ta</legend>
            <div className="mt-2 flex gap-1">
              {RATING_VALUES.map((value) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                    className="sr-only"
                  />
                  <Star
                    aria-hidden="true"
                    className={
                      value <= rating
                        ? "h-7 w-7 fill-primary text-primary transition-colors"
                        : "h-7 w-7 text-muted-foreground/40 transition-colors"
                    }
                  />
                  <span className="sr-only">
                    {value} {value === 1 ? "stea" : "stele"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            Recenzia ta
            <textarea
              name="quote"
              placeholder="Cum a fost experiența cu #facemceneplace?"
              required
              minLength={10}
              maxLength={1200}
              rows={4}
            />
          </label>
          <div hidden aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" maxLength={200} />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">
            Numele și recenzia vor fi publice după aprobare. Nu include date personale de contact.
          </p>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button variant="studio" type="submit" disabled={busy}>
            {busy ? "Se trimite…" : "Trimite recenzia"}
            <ArrowUpRight aria-hidden />
          </Button>
        </form>
      )}
    </div>
  );
}
