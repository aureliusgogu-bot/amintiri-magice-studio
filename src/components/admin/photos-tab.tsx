import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUp, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { photoUrl } from "@/lib/site-data";
import {
  CategoryPicker,
  Field,
  Notice,
  friendlyError,
  inputClass,
  resizeImage,
} from "./admin-shared";

type Row = {
  id: string;
  title: string;
  category: string;
  small_path: string;
  large_path: string;
  aspect_ratio: number;
  sort_order: number;
};
type Pending = { file: File; preview: string; title: string; category: string };

export function PhotosTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [progress, setProgress] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) setError(friendlyError(error));
    else setRows(data.map((r) => ({ ...r, aspect_ratio: Number(r.aspect_ratio) })));
    setLoading(false);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const extra = [...new Set(rows.map((r) => r.category))];

  function pick(files: FileList | null) {
    if (!files) return;
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    setPending((p) => [
      ...p,
      ...list.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        title: "",
        category: p[0]?.category ?? "Nunți",
      })),
    ]);
    setOk("");
    setError("");
  }

  async function upload() {
    const missing = pending.find((p) => !p.category.trim());
    if (missing) return setError("Alege o categorie pentru fiecare fotografie.");
    setBusy(true);
    setError("");
    setOk("");
    const top = rows.length ? Math.min(...rows.map((r) => r.sort_order)) : 0;
    let done = 0;
    const failed: Pending[] = [];
    for (const [i, p] of pending.entries()) {
      setProgress(`Se încarcă fotografia ${i + 1} din ${pending.length}…`);
      try {
        const [small, large] = await Promise.all([
          resizeImage(p.file, 800),
          resizeImage(p.file, 1800),
        ]);
        const base = `uploads/${crypto.randomUUID()}`;
        const opts = { contentType: "image/jpeg", upsert: false };
        const a = await supabase.storage
          .from("portfolio")
          .upload(`${base}-small.jpg`, small.blob, opts);
        if (a.error) throw a.error;
        const b = await supabase.storage
          .from("portfolio")
          .upload(`${base}-large.jpg`, large.blob, opts);
        if (b.error) throw b.error;
        const { error } = await supabase.from("photos").insert({
          title: p.title.trim() || p.category.trim(),
          category: p.category.trim(),
          small_path: `${base}-small.jpg`,
          large_path: `${base}-large.jpg`,
          aspect_ratio: Math.round(large.ratio * 1000) / 1000,
          // First selected photo ends up first on the site.
          sort_order: top - pending.length + i,
        });
        if (error) {
          await supabase.storage
            .from("portfolio")
            .remove([`${base}-small.jpg`, `${base}-large.jpg`]);
          throw error;
        }
        URL.revokeObjectURL(p.preview);
        done++;
      } catch (e) {
        failed.push(p);
        setError(`„${p.file.name}”: ${friendlyError(e)}`);
      }
    }
    setPending(failed);
    setProgress("");
    setBusy(false);
    if (done)
      setOk(done === 1 ? "Fotografia a fost adăugată." : `${done} fotografii au fost adăugate.`);
    await load();
  }

  async function save(row: Row) {
    if (!row.category.trim()) return setError("Categoria nu poate fi goală.");
    const { error } = await supabase
      .from("photos")
      .update({ title: row.title.trim(), category: row.category.trim() })
      .eq("id", row.id);
    if (error) setError(friendlyError(error));
    else setOk("Modificările au fost salvate.");
  }

  async function reorder(next: Row[]) {
    const changed = next
      .map((r, i) => ({ ...r, sort_order: i }))
      .filter((r, i) => rows.find((o) => o.id === r.id)?.sort_order !== i);
    setRows(next.map((r, i) => ({ ...r, sort_order: i })));
    const results = await Promise.all(
      changed.map((r) =>
        supabase.from("photos").update({ sort_order: r.sort_order }).eq("id", r.id),
      ),
    );
    const failed = results.find((r) => r.error);
    if (failed) {
      setError(friendlyError(failed.error));
      await load();
    }
  }
  function move(index: number, to: number) {
    const next = [...rows];
    const [item] = next.splice(index, 1);
    if (item) next.splice(to, 0, item);
    void reorder(next);
  }

  async function remove(row: Row) {
    if (!window.confirm(`Ștergi fotografia „${row.title}”? Acțiunea nu poate fi anulată.`)) return;
    const { error } = await supabase.from("photos").delete().eq("id", row.id);
    if (error) return setError(friendlyError(error));
    await supabase.storage.from("portfolio").remove([row.small_path, row.large_path]);
    setRows((r) => r.filter((x) => x.id !== row.id));
    setOk("Fotografia a fost ștearsă.");
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-xl border border-border bg-card/40 p-4 sm:p-6">
        <h2 className="font-display text-2xl">Adaugă fotografii</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Poți alege mai multe fotografii deodată. Le micșorăm automat înainte de încărcare.
        </p>
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary/60 p-6 text-primary focus-within:ring-2 focus-within:ring-ring">
          <Upload size={18} aria-hidden />
          Alege fotografii
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              pick(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {pending.length > 0 && (
          <ul className="mt-4 flex flex-col gap-4">
            {pending.map((p, i) => (
              <li key={p.preview} className="flex gap-3">
                <img
                  src={p.preview}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <input
                    className={inputClass}
                    placeholder="Titlu (opțional)"
                    aria-label="Titlul fotografiei"
                    value={p.title}
                    maxLength={80}
                    onChange={(e) =>
                      setPending((list) =>
                        list.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)),
                      )
                    }
                  />
                  <CategoryPicker
                    value={p.category}
                    extra={extra}
                    onChange={(category) =>
                      setPending((list) => list.map((x, j) => (j === i ? { ...x, category } : x)))
                    }
                  />
                  <button
                    type="button"
                    className="self-start text-sm text-muted-foreground underline"
                    disabled={busy}
                    onClick={() => setPending((list) => list.filter((_, j) => j !== i))}
                  >
                    Renunță la aceasta
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {pending.length > 0 && (
          <Button
            variant="studio"
            className="mt-4 w-full sm:w-auto"
            disabled={busy}
            onClick={upload}
          >
            {busy
              ? "Se încarcă…"
              : `Încarcă ${pending.length === 1 ? "fotografia" : `${pending.length} fotografii`}`}
          </Button>
        )}
        <div className="mt-3 flex flex-col gap-1" aria-live="polite">
          {progress && <Notice kind="info">{progress}</Notice>}
        </div>
      </section>

      <div aria-live="polite">
        {error && <Notice kind="error">{error}</Notice>}
        {ok && <Notice kind="ok">{ok}</Notice>}
      </div>

      <section>
        <h2 className="font-display text-2xl">Fotografiile de pe site ({rows.length})</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Prima fotografie din listă apare prima pe site.
        </p>
        {loading ? (
          <Notice kind="info">Se încarcă…</Notice>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {rows.map((row, i) => (
              <li
                key={row.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-3 sm:flex-row"
              >
                <img
                  src={photoUrl(row.small_path)}
                  alt={row.title}
                  loading="lazy"
                  className="h-40 w-full rounded-md bg-gradient-to-br from-card to-muted object-cover sm:h-24 sm:w-24"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <Field label="Titlu">
                    <input
                      className={inputClass}
                      value={row.title}
                      maxLength={80}
                      onChange={(e) =>
                        setRows((r) =>
                          r.map((x) => (x.id === row.id ? { ...x, title: e.target.value } : x)),
                        )
                      }
                    />
                  </Field>
                  <Field label="Categorie">
                    <CategoryPicker
                      value={row.category}
                      extra={extra}
                      onChange={(category) =>
                        setRows((r) => r.map((x) => (x.id === row.id ? { ...x, category } : x)))
                      }
                    />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="studio" size="sm" onClick={() => save(row)}>
                      Salvează
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={i === 0}
                      onClick={() => move(i, i - 1)}
                      aria-label="Mută mai sus"
                    >
                      <ArrowUp size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={i === rows.length - 1}
                      onClick={() => move(i, i + 1)}
                      aria-label="Mută mai jos"
                    >
                      <ArrowDown size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={i === 0}
                      onClick={() => move(i, 0)}
                    >
                      <ChevronsUp size={16} /> Mută la început
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => remove(row)}
                    >
                      <Trash2 size={16} /> Șterge
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
