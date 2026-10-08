import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_SETTINGS, type Person } from "@/lib/site-data";
import { Field, Notice, friendlyError, inputClass } from "./admin-shared";

type Review = { id: string; quote: string; author: string; event: string; sort_order: number };

function useMessages() {
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  return {
    error,
    ok,
    fail: (e: unknown) => {
      setOk("");
      setError(typeof e === "string" ? e : friendlyError(e));
    },
    success: (m: string) => {
      setError("");
      setOk(m);
    },
    view: (
      <div aria-live="polite">
        {error && <Notice kind="error">{error}</Notice>}
        {ok && <Notice kind="ok">{ok}</Notice>}
      </div>
    ),
  };
}

export function ReviewsTab() {
  const [rows, setRows] = useState<Review[]>([]);
  const [draft, setDraft] = useState({ quote: "", author: "", event: "" });
  const msg = useMessages();
  const load = useCallback(async () => {
    const { data, error } = await supabase.from("reviews").select("*").order("sort_order");
    if (error) msg.fail(error);
    else setRows(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!draft.quote.trim() || !draft.author.trim())
      return msg.fail("Completează recenzia și numele clientului.");
    const sort_order = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
    const { error } = await supabase.from("reviews").insert({
      quote: draft.quote.trim(),
      author: draft.author.trim(),
      event: draft.event.trim(),
      sort_order,
    });
    if (error) return msg.fail(error);
    setDraft({ quote: "", author: "", event: "" });
    msg.success("Recenzia a fost adăugată.");
    await load();
  }
  async function save(r: Review) {
    if (!r.quote.trim() || !r.author.trim()) return msg.fail("Recenzia și numele nu pot fi goale.");
    const { error } = await supabase
      .from("reviews")
      .update({ quote: r.quote.trim(), author: r.author.trim(), event: r.event.trim() })
      .eq("id", r.id);
    if (error) msg.fail(error);
    else msg.success("Recenzia a fost salvată.");
  }
  async function remove(r: Review) {
    if (!window.confirm(`Ștergi recenzia lui ${r.author}?`)) return;
    const { error } = await supabase.from("reviews").delete().eq("id", r.id);
    if (error) return msg.fail(error);
    setRows((x) => x.filter((y) => y.id !== r.id));
    msg.success("Recenzia a fost ștearsă.");
  }
  async function move(i: number, to: number) {
    const next = [...rows];
    const [item] = next.splice(i, 1);
    if (item) next.splice(to, 0, item);
    setRows(next.map((r, k) => ({ ...r, sort_order: k })));
    const res = await Promise.all(
      next.map((r, k) => supabase.from("reviews").update({ sort_order: k }).eq("id", r.id)),
    );
    const bad = res.find((r) => r.error);
    if (bad) {
      msg.fail(bad.error);
      await load();
    }
  }
  const set = (id: string, patch: Partial<Review>) =>
    setRows((x) => x.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={add}
        className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4 sm:p-6"
      >
        <h2 className="font-display text-2xl">Adaugă o recenzie</h2>
        <Field label="Recenzia">
          <textarea
            className={inputClass}
            rows={4}
            maxLength={1200}
            value={draft.quote}
            onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
          />
        </Field>
        <Field label="Numele clientului">
          <input
            className={inputClass}
            maxLength={80}
            value={draft.author}
            onChange={(e) => setDraft({ ...draft, author: e.target.value })}
          />
        </Field>
        <Field label="Tipul evenimentului (ex. Nuntă)">
          <input
            className={inputClass}
            maxLength={60}
            value={draft.event}
            onChange={(e) => setDraft({ ...draft, event: e.target.value })}
          />
        </Field>
        <Button variant="studio" type="submit" className="self-start">
          Adaugă recenzia
        </Button>
      </form>
      {msg.view}
      <section>
        <h2 className="font-display text-2xl">Recenzii pe site ({rows.length})</h2>
        {rows.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Nu există recenzii. Pe site apare doar butonul către recenziile de pe Facebook.
          </p>
        )}
        <ul className="mt-4 flex flex-col gap-3">
          {rows.map((r, i) => (
            <li
              key={r.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card/40 p-3"
            >
              <Field label="Recenzia">
                <textarea
                  className={inputClass}
                  rows={3}
                  maxLength={1200}
                  value={r.quote}
                  onChange={(e) => set(r.id, { quote: e.target.value })}
                />
              </Field>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Nume">
                  <input
                    className={inputClass}
                    maxLength={80}
                    value={r.author}
                    onChange={(e) => set(r.id, { author: e.target.value })}
                  />
                </Field>
                <Field label="Eveniment">
                  <input
                    className={inputClass}
                    maxLength={60}
                    value={r.event}
                    onChange={(e) => set(r.id, { event: e.target.value })}
                  />
                </Field>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="studio" size="sm" onClick={() => save(r)}>
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
                  className="text-destructive"
                  onClick={() => remove(r)}
                >
                  <Trash2 size={16} /> Șterge
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

type Settings = {
  people: Person[];
  email: string;
  facebook_url: string;
  instagram_url: string;
  location_hero: string;
  location_contact: string;
};

export function DetailsTab() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const msg = useMessages();
  useEffect(() => {
    void supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) msg.fail(error);
        const people = Array.isArray(data?.people)
          ? (data.people as Person[])
          : DEFAULT_SETTINGS.people;
        setS({
          people: [0, 1].map((i) => people[i] ?? { name: "", phone: "" }),
          email: data?.email ?? DEFAULT_SETTINGS.email,
          facebook_url: data?.facebook_url ?? DEFAULT_SETTINGS.facebook,
          instagram_url: data?.instagram_url ?? DEFAULT_SETTINGS.instagram,
          location_hero: data?.location_hero ?? DEFAULT_SETTINGS.locationHero,
          location_contact: data?.location_contact ?? DEFAULT_SETTINGS.locationContact,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!s) return <Notice kind="info">Se încarcă…</Notice>;

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!s) return;
    const people = s.people
      .map((p) => ({ name: p.name.trim(), phone: p.phone.replace(/[^\d]/g, "") }))
      .filter((p) => p.name || p.phone);
    if (people.some((p) => !p.name || p.phone.length !== 10))
      return msg.fail(
        "Fiecare persoană are nevoie de nume și de un număr de telefon cu 10 cifre (ex. 0727113893).",
      );
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim()))
      return msg.fail("Adresa de email nu pare corectă.");
    for (const url of [s.facebook_url, s.instagram_url])
      if (!/^https:\/\/\S+$/.test(url.trim()))
        return msg.fail("Linkurile trebuie să înceapă cu https://");
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        people,
        email: s.email.trim().toLowerCase(),
        facebook_url: s.facebook_url.trim(),
        instagram_url: s.instagram_url.trim(),
        location_hero: s.location_hero.trim(),
        location_contact: s.location_contact.trim(),
      })
      .eq("id", 1);
    setSaving(false);
    if (error) msg.fail(error);
    else msg.success("Detaliile au fost salvate. Apar pe site imediat ce pagina este reîncărcată.");
  }
  const setPerson = (i: number, patch: Partial<Person>) =>
    setS({ ...s, people: s.people.map((p, j) => (j === i ? { ...p, ...patch } : p)) });

  return (
    <form onSubmit={save} className="flex flex-col gap-6">
      {s.people.map((p, i) => (
        <fieldset
          key={i}
          className="grid gap-3 rounded-xl border border-border bg-card/40 p-4 sm:grid-cols-2"
        >
          <legend className="px-1 text-sm text-primary">Persoana {i + 1}</legend>
          <Field label="Nume">
            <input
              className={inputClass}
              maxLength={60}
              value={p.name}
              onChange={(e) => setPerson(i, { name: e.target.value })}
            />
          </Field>
          <Field label="Telefon">
            <input
              className={inputClass}
              type="tel"
              inputMode="tel"
              maxLength={14}
              value={p.phone}
              onChange={(e) => setPerson(i, { phone: e.target.value })}
            />
          </Field>
        </fieldset>
      ))}
      <div className="grid gap-3 rounded-xl border border-border bg-card/40 p-4">
        <Field label="Email de contact">
          <input
            className={inputClass}
            type="email"
            maxLength={120}
            value={s.email}
            onChange={(e) => setS({ ...s, email: e.target.value })}
          />
        </Field>
        <Field label="Link Facebook">
          <input
            className={inputClass}
            type="url"
            maxLength={300}
            value={s.facebook_url}
            onChange={(e) => setS({ ...s, facebook_url: e.target.value })}
          />
        </Field>
        <Field label="Link Instagram">
          <input
            className={inputClass}
            type="url"
            maxLength={300}
            value={s.instagram_url}
            onChange={(e) => setS({ ...s, instagram_url: e.target.value })}
          />
        </Field>
        <Field label="Locația din prima parte a site-ului">
          <input
            className={inputClass}
            maxLength={80}
            value={s.location_hero}
            onChange={(e) => setS({ ...s, location_hero: e.target.value })}
          />
        </Field>
        <Field label="Locația din secțiunea de contact">
          <input
            className={inputClass}
            maxLength={120}
            value={s.location_contact}
            onChange={(e) => setS({ ...s, location_contact: e.target.value })}
          />
        </Field>
      </div>
      {msg.view}
      <Button variant="studio" type="submit" disabled={saving} className="self-start">
        {saving ? "Se salvează…" : "Salvează detaliile"}
      </Button>
    </form>
  );
}

export function AccessTab({ me }: { me: string }) {
  const [rows, setRows] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const msg = useMessages();
  const load = useCallback(async () => {
    const { data, error } = await supabase.from("admin_emails").select("email").order("created_at");
    if (error) msg.fail(error);
    else setRows(data.map((r) => r.email));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  async function add(e: FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return msg.fail("Adresa de email nu pare corectă.");
    const { error } = await supabase.from("admin_emails").insert({ email: value });
    if (error) return msg.fail(error);
    setEmail("");
    msg.success(`${value} poate intra acum în administrare.`);
    await load();
  }
  async function remove(value: string) {
    if (rows.length <= 1) return msg.fail("Nu poți șterge ultimul administrator.");
    const self = value === me;
    if (
      !window.confirm(
        self
          ? "Îți retragi propriul acces? Vei fi deconectat."
          : `Retragi accesul pentru ${value}?`,
      )
    )
      return;
    const { error } = await supabase.from("admin_emails").delete().eq("email", value);
    if (error) return msg.fail(error);
    if (self) return void supabase.auth.signOut();
    msg.success("Accesul a fost retras.");
    await load();
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={add}
        className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4 sm:p-6"
      >
        <h2 className="font-display text-2xl">Dă acces cuiva</h2>
        <p className="text-sm text-muted-foreground">
          Persoana va putea intra pe această pagină cu adresa ei de email și va putea modifica tot
          site-ul.
        </p>
        <Field label="Adresa de email">
          <input
            className={inputClass}
            type="email"
            maxLength={120}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Button variant="studio" type="submit" className="self-start">
          Adaugă
        </Button>
      </form>
      {msg.view}
      <ul className="flex flex-col gap-2">
        {rows.map((r) => (
          <li
            key={r}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/40 p-3"
          >
            <span className="break-all">
              {r} {r === me && <span className="text-sm text-primary">(tu)</span>}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              disabled={rows.length <= 1}
              onClick={() => remove(r)}
            >
              <Trash2 size={16} /> Retrage
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
