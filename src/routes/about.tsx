import { createFileRoute } from "@tanstack/react-router";
import { TrustPage } from "@/features/trust/trust-page";
import { trustPageHead } from "@/lib/trust-pages";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => trustPageHead("about"),
  component: () => <TrustPage pageKey="about" />,
});