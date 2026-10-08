import { useMemo, useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryPhoto } from "@/lib/site-data";
import { recommendPortfolio } from "@/lib/recommend.functions";

export function PortfolioRecommender({ items }: { items: GalleryPhoto[] }) {
  // The AI sees only titles and categories (at most 100), never the images themselves.
  const photos = items;
  const catalog = useMemo(
    () => items.slice(0, 100).map((p, id) => ({ id, title: p.title, category: p.category })),
    [items],
  );
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
    <section id="recomandari" className="recommend-section" aria-labelledby="recomandari-titlu">
      <div className="section-inner">
        <p className="section-kicker">Recomandări</p>
        <h2 id="recomandari-titlu" className="section-title">
          Spune-ne ce <em>îți dorești.</em>
        </h2>
        <p className="recommend-intro">
          Descrie evenimentul sau ședința foto la care visezi, iar noi îți arătăm fotografiile din
          portofoliu care se potrivesc cel mai bine.
        </p>
        <form onSubmit={onSubmit} className="recommend-form">
          <label htmlFor="recomandari-descriere" className="sr-only">
            Descrierea evenimentului
          </label>
          <textarea
            id="recomandari-descriere"
            className="recommend-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="De exemplu: o cununie civilă intimă, în parc, toamna, cu lumină caldă…"
          />
          <div>
            <Button variant="studio" type="submit" disabled={loading}>
              <Sparkles aria-hidden="true" />
              {loading ? "Căutăm fotografiile…" : "Recomandă-mi fotografii"}
            </Button>
          </div>
        </form>
        <div aria-live="polite" className="recommend-result">
          {error && <p className="text-destructive">{error}</p>}
          {result && result.ids.length > 0 && (
            <>
              {result.reason && <p className="recommend-reason">{result.reason}</p>}
              <ul className="recommend-grid">
                {result.ids.map((id) => {
                  const p = photos[id];
                  if (!p) return null;
                  return (
                    <li key={id}>
                      <img
                        src={p.src}
                        alt={`${p.title} — ${p.category}`}
                        loading="lazy"
                        onError={(e) => (e.currentTarget.style.opacity = "0")}
                      />
                      <p>
                        {p.title} <span>· {p.category}</span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
