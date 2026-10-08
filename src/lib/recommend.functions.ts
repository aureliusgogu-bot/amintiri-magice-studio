import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  description: z.string().trim().min(5).max(1000),
  catalog: z
    .array(
      z.object({ id: z.number().int(), title: z.string().max(120), category: z.string().max(60) }),
    )
    .max(100),
});

// Simple abuse guard so one visitor (or a script) cannot burn through the AI credits:
// at most 4 requests per 10 minutes per visitor, and 150 per hour for the whole site.
// Counters live in the memory of the running server instance, so they are approximate but cheap.
const visitorHits = new Map<string, number[]>();
let siteHits: number[] = [];
function overLimit(visitor: string, now: number) {
  siteHits = siteHits.filter((t) => now - t < 3_600_000);
  const mine = (visitorHits.get(visitor) ?? []).filter((t) => now - t < 600_000);
  if (visitorHits.size > 5000) visitorHits.clear();
  if (mine.length >= 4 || siteHits.length >= 150) {
    visitorHits.set(visitor, mine);
    return true;
  }
  mine.push(now);
  siteHits.push(now);
  visitorHits.set(visitor, mine);
  return false;
}

export const recommendPortfolio = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data }) => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const visitor =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (overLimit(visitor, Date.now()))
      return {
        ok: false as const,
        error: "Ai făcut deja mai multe căutări. Încearcă din nou peste câteva minute.",
      };
    const { recommendPhotos } = await import("./recommend.server");
    try {
      return { ok: true as const, ...(await recommendPhotos(data.description, data.catalog)) };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      const status = (error as { statusCode?: number })?.statusCode;
      if (status === 429)
        return {
          ok: false as const,
          error: "Prea multe cereri. Încearcă din nou peste câteva momente.",
        };
      if (status === 402)
        return {
          ok: false as const,
          error: "Serviciul de recomandări este momentan indisponibil.",
        };
      console.error("recommend failed", status, msg);
      return {
        ok: false as const,
        error: "Nu am putut genera recomandări acum. Încearcă din nou mai târziu.",
      };
    }
  });
