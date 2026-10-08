import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { visitorReviewSchema } from "./review-schema";

export const submitVisitorReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => visitorReviewSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { ok: false };
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return { ok: false };
    const db = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
            headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });
    const { error } = await db.rpc("submit_visitor_review", {
      p_author: data.author,
      p_quote: data.quote,
      p_event: data.event,
    });
    return { ok: !error };
  });