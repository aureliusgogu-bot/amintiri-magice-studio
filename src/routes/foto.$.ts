import { createFileRoute } from "@tanstack/react-router";

// Serves images from the private "portfolio" storage bucket. Only that bucket is
// readable here, and every file in it is already public on the site.
export const Route = createFileRoute("/foto/$")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..") || !/^[\w\-./]+$/.test(path))
          return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("portfolio").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "content-type": data.type || "image/jpeg",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
