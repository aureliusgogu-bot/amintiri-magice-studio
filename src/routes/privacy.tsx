import { createFileRoute } from "@tanstack/react-router";
import { TrustPage } from "@/features/trust/trust-page";
import { trustPageHead } from "@/lib/trust-pages";
import { getSiteData } from "@/lib/site-data.functions";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => trustPageHead("privacy"),
  loader: () => getSiteData(),
  errorComponent: () => <TrustPage pageKey="privacy" />,
  notFoundComponent: () => <TrustPage pageKey="privacy" />,
  component: PrivacyPage,
});

function PrivacyPage() { return <TrustPage pageKey="privacy" data={Route.useLoaderData()} />; }