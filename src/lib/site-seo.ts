import { DEFAULT_SITE_DATA, type GalleryPhoto, type SiteData } from "./site-data";

export const SITE_ORIGIN = "https://facemceneplace.com";
export const BUSINESS_ID = `${SITE_ORIGIN}/#facemceneplace`;
export const STUDIO_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Strada Tudor Vladimirescu",
  addressLocality: "Domnești",
  addressRegion: "Ilfov",
  postalCode: "077090",
  addressCountry: "RO",
} as const;
export const STUDIO_ADDRESS_LABEL = "Strada Tudor Vladimirescu, Domnești, Ilfov 077090";
export const STUDIO_HOURS_LABEL = "Program: non-stop (24/7)";

/** Match structured data to the same public settings and effective gallery used by the page. */
export function buildStudioSchema(
  data: SiteData | null | undefined,
  fallbackPhotos: GalleryPhoto[],
  hero: { url: string; alt: string },
  description: string,
) {
  const { settings, photos } = data ?? DEFAULT_SITE_DATA;
  const credit = {
    creator: { "@type": "Organization", name: "#facemceneplace", url: `${SITE_ORIGIN}/` },
    creditText: "#facemceneplace",
    copyrightNotice: `© ${new Date().getFullYear()} #facemceneplace`,
  };
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: "#facemceneplace",
    legalName: "FACEM CE NE PLACE S.R.L",
    vatID: "52881469",
    description,
    url: `${SITE_ORIGIN}/`,
    email: settings.email,
    areaServed: { "@type": "Country", name: "România" },
    address: STUDIO_ADDRESS,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    telephone: settings.people.map(({ phone }) => phone.startsWith("+") ? phone : `+4${phone}`),
    sameAs: [settings.facebook, settings.instagram],
    employee: settings.people.map(({ name }) => ({ "@type": "Person", name })),
    image: [
      {
        "@type": "ImageObject",
        contentUrl: new URL(hero.url, SITE_ORIGIN).href,
        caption: hero.alt,
        name: "#facemceneplace",
        ...credit,
      },
      ...(photos ?? fallbackPhotos).map((photo) => ({
        "@type": "ImageObject",
        contentUrl: new URL(photo.highRes, SITE_ORIGIN).href,
        thumbnailUrl: new URL(photo.src, SITE_ORIGIN).href,
        name: photo.title,
        caption: `${photo.title} — ${photo.category}`,
        ...credit,
      })),
    ],
  };
}