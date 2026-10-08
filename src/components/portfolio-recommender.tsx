import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/components/portfolio-gallery";
import { recommendPortfolio } from "@/lib/recommend.functions";

const catalog = photos.map((p, id) => ({ id, title: p.title, category: p.category }));

export function PortfolioRecommender() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ ids: number[]; reason: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (description.trim().length < 5) {
      setError("Descrie puțin mai mult evenimentul sau ședința dorită.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await recommendPortfolio({ data: { description, catalog } });
      if (res.ok) {
        setResult({ ids: res.ids, reason: res.reason });
        if (res.ids.length === 0)
          setError("Nu am găsit fotografii potrivite. Încearcă o altă descriere.");
      } else setError(res.error);
    } catch {
      setError("Nu am putut genera recomandări acum. Încearcă din nou mai târziu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="recomandari"
      className="mx-auto max-w-6xl px-6 py-24"
      aria-labelledby="recomandari-titlu"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-primary">Recomandări</p>
      <h2 id="recomandari-titlu" className="mt-3 font-display text-3xl sm:text-5xl">
        Spune-ne ce îți dorești
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Descrie evenimentul sau ședința foto la care visezi, iar noi îți arătăm fotografiile din
        portofoliu care se potrivesc cel mai bine.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <label htmlFor="recomandari-descriere" className="sr-only">
          Descrierea evenimentului
        </label>
        <textarea
          id="recomandari-descriere"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="De exemplu: o cununie civilă intimă, în parc, toamna, cu lumină caldă…"
          className="w-full rounded-lg border border-border bg-card/40 p-4 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div>
          <Button type="submit" disabled={loading}>
            <Sparkles aria-hidden="true" />
            {loading ? "Căutăm fotografiile…" : "Recomandă-mi fotografii"}
          </Button>
        </div>
      </form>
      <div aria-live="polite" className="mt-8">
        {error && <p className="text-destructive">{error}</p>}
        {result && result.ids.length > 0 && (
          <>
            {result.reason && <p className="mb-6 text-muted-foreground">{result.reason}</p>}
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {result.ids.map((id) => {
                const p = photos[id];
                return (
                  <li
                    key={id}
                    className="overflow-hidden rounded-lg bg-gradient-to-br from-card to-muted"
                  >
                    <img
                      src={p.src}
                      alt={`${p.title} — ${p.category}`}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover"
                      onError={(e) => (e.currentTarget.style.opacity = "0")}
                    />
                    <p className="p-3 text-sm">
                      {p.title} <span className="text-muted-foreground">· {p.category}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
