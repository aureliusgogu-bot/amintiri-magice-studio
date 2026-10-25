import { describe, expect, it } from "vitest";
import { buildStudioSchema, STUDIO_ADDRESS } from "@/lib/site-seo";
import { DEFAULT_SITE_DATA, type GalleryPhoto } from "@/lib/site-data";

const fallback: GalleryPhoto[] = [{ src: "/fallback-small.jpg", highRes: "/fallback.jpg", title: "Fallback", category: "Nunți", aspectRatio: 1 }];
const build = (data = DEFAULT_SITE_DATA) => buildStudioSchema(data, fallback, { url: "/hero.jpg", alt: "Miri" }, "Foto și video");

describe("Confirmed public studio information", () => {
  it("uses the supplied address without inventing a number or coordinates", () => {
    expect(build().address).toEqual({ "@type": "PostalAddress", streetAddress: "Strada Tudor Vladimirescu", addressLocality: "Domnești", addressRegion: "Ilfov", postalCode: "077090", addressCountry: "RO" });
    expect(STUDIO_ADDRESS.streetAddress).toBe("Strada Tudor Vladimirescu");
    expect(build()).not.toHaveProperty("geo");
  });
  it("represents the confirmed 24/7 hours on all seven days", () => {
    expect(build().openingHoursSpecification).toEqual({ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" });
  });
  it("uses database gallery photos rather than the bundled fallback when available", () => {
    const schema = build({ ...DEFAULT_SITE_DATA, photos: [{ ...fallback[0], src: "/foto/db-small.jpg", highRes: "/foto/db.jpg", title: "Database" }] });
    expect(schema.image.map((image) => image.contentUrl)).toEqual(["https://facemceneplace.com/hero.jpg", "https://facemceneplace.com/foto/db.jpg"]);
  });
  it("keeps the bundled gallery only when the public data uses the fallback", () => {
    expect(build().image[1].contentUrl).toBe("https://facemceneplace.com/fallback.jpg");
  });
  it("preserves the confirmed legal identity and contacts", () => {
    expect(build().legalName).toBe("FACEM CE NE PLACE S.R.L");
    expect(build().vatID).toBe("52881469");
    expect(build().telephone).toEqual(["+40727113893", "+40720179744"]);
  });
});