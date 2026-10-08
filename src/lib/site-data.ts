import { createContext, useContext } from "react";

export type Person = { name: string; phone: string };
export type Review = { quote: string; author: string; event: string };
export type GalleryPhoto = {
  src: string;
  highRes: string;
  aspectRatio: number;
  category: string;
  title: string;
};
export type SiteSettings = {
  people: Person[];
  email: string;
  facebook: string;
  instagram: string;
  locationHero: string;
  locationContact: string;
};
export type SiteData = {
  settings: SiteSettings;
  reviews: Review[];
  /** null = use the bundled fallback photos. */
  photos: GalleryPhoto[] | null;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  people: [
    { name: "George Constantin", phone: "0727113893" },
    { name: "Petrișor Stan", phone: "0720179744" },
  ],
  email: "facemceneplace@gmail.com",
  facebook: "https://www.facebook.com/share/1BagDkJcXJ/",
  instagram: "https://www.instagram.com/george.constantin1701",
  locationHero: "Ilfov · În toată țara",
  locationContact: "Sediul în Ilfov · Ne deplasăm în toată țara",
};

export const DEFAULT_SITE_DATA: SiteData = { settings: DEFAULT_SETTINGS, reviews: [], photos: null };

/** Fixed order for the known categories; new ones follow in first-seen order. */
export const BASE_CATEGORIES = ["Nunți", "Cununie civilă", "Majorat", "Botez", "Evenimente"];

export function orderedCategories(list: { category: string }[]) {
  const seen = new Set(list.map((p) => p.category));
  const extra = [...seen].filter((c) => !BASE_CATEGORIES.includes(c));
  return [...BASE_CATEGORIES.filter((c) => seen.has(c)), ...extra];
}

/** Photos live in a private bucket and are served through the /foto/ route. */
export const photoUrl = (path: string) => `/foto/${path.split("/").map(encodeURIComponent).join("/")}`;

export const SiteContext = createContext<SiteData>(DEFAULT_SITE_DATA);
export const useSite = () => useContext(SiteContext);
