import { createFileRoute } from "@tanstack/react-router";
import { TrustPage } from "@/features/trust/trust-page";
import { trustPageHead } from "@/lib/trust-pages";
import { getSiteData } from "@/lib/site-data.functions";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => trustPageHead("contact"),
  loader: () => getSiteData(),
  errorComponent: () => <TrustPage pageKey="contact" />,
  notFoundComponent: () => <TrustPage pageKey="contact" />,
  component: ContactPage,
});

function ContactPage() { return <TrustPage pageKey="contact" data={Route.useLoaderData()} />; }