import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitVisitorReview } from "@/lib/review-submissions.functions";
import { visitorReviewSchema } from "@/lib/review-schema";

export function VisitorReviewForm() {
  const send = useServerFn(submitVisitorReview);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const parsed = visitorReviewSchema.safeParse(Object.fromEntries(form));
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
