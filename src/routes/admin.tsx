import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Field, Notice, inputClass } from "@/components/admin/admin-shared";
import { PhotosTab } from "@/components/admin/photos-tab";
import { AccessTab, DetailsTab, ReviewsTab } from "@/components/admin/content-tabs";

export const Route = createFileRoute("/admin")({
  ssr: false,
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Administrare — #facemceneplace" },
      { name: "description", content: "Zona privată de administrare a site-ului #facemceneplace." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Administrare — #facemceneplace" },
      { property: "og:description", content: "Zona privată de administrare a site-ului #facemceneplace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const tabs = [
  ["fotografii", "Fotografii"],
  ["recenzii", "Recenzii"],
  ["detalii", "Detalii"],
  ["acces", "Acces"],
] as const;
type Tab = (typeof tabs)[number][0];

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6 sm:px-6">{children}</div>
    </div>
  );
}

function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [admin, setAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    setAdmin(null);
    if (!session) return;
    void supabase.rpc("is_admin").then(({ data, error }) => setAdmin(!error && data === true));
  }, [session?.user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (session === undefined || (session && admin === null))
    return (
      <Shell>
        <Notice kind="info">Se încarcă…</Notice>
      </Shell>
    );
  if (!session) return <Login />;
  const email = session.user.email ?? "";
  if (!admin)
    return (
      <Shell>
        <div className="mt-20 flex flex-col items-start gap-4">
          <h1 className="font-display text-4xl">Acest cont nu are acces</h1>
          <p className="text-muted-foreground">
            Ești conectat ca <strong className="text-foreground">{email}</strong>, dar această adresă nu poate
            administra site-ul. Dacă e o greșeală, cere unui administrator să te adauge.
          </p>
          <Button variant="studio" onClick={() => supabase.auth.signOut()}>
            <LogOut size={16} /> Deconectează-te
          </Button>
        </div>
      </Shell>
    );
  return <Dashboard email={email} />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(e: FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return setError("Adresa de email nu pare corectă.");
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: value,
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error)
      setError(
        /rate|seconds/i.test(error.message)
          ? "Ai cerut deja un email. Așteaptă un minut și încearcă din nou."
          : "Nu am putut trimite emailul. Încearcă din nou.",
      );
    else setSent(true);
  }
  async function verify(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: "email" });
    setBusy(false);
    if (error) setError("Codul nu este corect sau a expirat. Cere un email nou.");
  }

  return (
    <Shell>
      <div className="mx-auto mt-16 flex max-w-md flex-col gap-6">
        <p className="font-display text-2xl">
          <span className="text-primary">#</span>facemceneplace
        </p>
        <h1 className="font-display text-4xl">Administrare</h1>
        {!sent ? (
          <form onSubmit={send} className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Scrie adresa ta de email. Îți trimitem un link de conectare, fără parolă.
            </p>
            <Field label="Adresa de email">
              <input className={inputClass} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Button variant="studio" type="submit" disabled={busy}>
              {busy ? "Se trimite…" : "Trimite-mi linkul"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verify} className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Ți-am trimis un email la <strong className="text-foreground">{email}</strong>. Deschide-l pe acest
              telefon și apasă pe link. Dacă emailul conține un cod, îl poți scrie mai jos.
            </p>
            <Field label="Cod din email (opțional)">
              <input className={inputClass} inputMode="numeric" autoComplete="one-time-code" maxLength={10} value={code} onChange={(e) => setCode(e.target.value)} />
            </Field>
            <Button variant="studio" type="submit" disabled={busy || code.trim().length < 6}>
              Conectează-te cu codul
            </Button>
            <button type="button" className="self-start text-sm text-muted-foreground underline" onClick={() => setSent(false)}>
              Folosește altă adresă sau trimite din nou
            </button>
          </form>
        )}
        <div aria-live="polite">{error && <Notice kind="error">{error}</Notice>}</div>
      </div>
    </Shell>
  );
}

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("fotografii");
  return (
    <Shell>
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl">
            <span className="text-primary">#</span>facemceneplace
          </p>
          <p className="text-xs text-muted-foreground break-all">{email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noopener">Vezi site-ul</a>
          </Button>
          <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()} aria-label="Deconectează-te">
            <LogOut size={16} />
          </Button>
        </div>
      </header>
      <nav
        className="sticky top-0 z-10 -mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-border bg-background/95 px-4 py-2 backdrop-blur"
        aria-label="Secțiuni"
      >
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-current={tab === id ? "page" : undefined}
            onClick={() => setTab(id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
      <main className="mt-6">
        {tab === "fotografii" && <PhotosTab />}
        {tab === "recenzii" && <ReviewsTab />}
        {tab === "detalii" && <DetailsTab />}
        {tab === "acces" && <AccessTab me={email.toLowerCase()} />}
      </main>
    </Shell>
  );
}
