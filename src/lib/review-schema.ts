import { z } from "zod";

export const visitorReviewSchema = z.object({
  author: z.string().trim().min(2, "Scrie un nume de cel puțin 2 caractere.").max(80),
  quote: z.string().trim().min(10, "Scrie o recenzie de cel puțin 10 caractere.").max(1200),
  event: z.string().trim().max(60),
  website: z.string().max(200).default(""),
});