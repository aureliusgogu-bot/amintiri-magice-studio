import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { DEFAULT_SETTINGS, photoUrl, type SiteData, type Person } from "./site-data";

const clean = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

/** Public, read-only: everything here is already visible on the site. */
export const getSiteData = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteData> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return { settings: DEFAULT_SETTINGS, reviews: [], photos: null };
    const db = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const [photos, reviews, settings] = await Promise.all([
      db
        .from("photos")
        .select("title,category,small_path,large_path,aspect_ratio")
        .order("sort_order")
        .order("created_at", { ascending: false }),
      db.from("reviews").select("quote,author,event").order("sort_order"),
      db.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    ]);
    if (photos.error || reviews.error || settings.error)
      console.error(
        "site data",
        photos.error?.message,
        reviews.error?.message,
        settings.error?.message,
      );

    const s = settings.data;
    const people = Array.isArray(s?.people)
      ? (s.people as Person[]).filter(
          (p) => p && typeof p.name === "string" && typeof p.phone === "string" && p.phone.trim(),
        )
      : [];
    return {
      settings: {
        people: people.length ? people : DEFAULT_SETTINGS.people,
        email: clean(s?.email, DEFAULT_SETTINGS.email),
        facebook: clean(s?.facebook_url, DEFAULT_SETTINGS.facebook),
        instagram: clean(s?.instagram_url, DEFAULT_SETTINGS.instagram),
        locationHero: clean(s?.location_hero, DEFAULT_SETTINGS.locationHero),
        locationContact: clean(s?.location_contact, DEFAULT_SETTINGS.locationContact),
      },
      reviews: reviews.data ?? [],
      photos: photos.data?.length
        ? photos.data.map((p) => ({
            src: photoUrl(p.small_path),
            highRes: photoUrl(p.large_path),
            aspectRatio: Number(p.aspect_ratio) || 0.67,
            category: p.category,
            title: p.title,
          }))
        : null,
    };
  },
);
