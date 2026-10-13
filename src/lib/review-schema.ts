import { z } from "zod";

export const visitorReviewSchema = z.object({
  author: z.string().trim().min(2, "Scrie un nume de cel puțin 2 caractere.").max(80),
  quote: z.string().trim().min(10, "Scrie o recenzie de cel puțin 10 caractere.").max(1200),
  event: z.string().trim().max(60),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Alege o notă între 1 și 5 stele.")
    .max(5, "Alege o notă între 1 și 5 stele.")
    .default(5),
  website: z.string().max(200).default(""),
});
