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

export const recommendPortfolio = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data }) => {
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
