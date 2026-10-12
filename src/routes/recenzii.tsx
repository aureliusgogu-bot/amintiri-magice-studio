import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteData } from "@/lib/site-data.functions";
import { ReviewCard, ReviewFacebookLink } from "@/features/reviews/reviews";
import { VisitorReviewForm } from "@/features/reviews/visitor-review-form";

const reviewsQuery = queryOptions({ queryKey: ["site-reviews"], queryFn: () => getSiteData() });
const title = "Recenzii clienți — #facemceneplace";
const description =
  "Citește experiențele clienților #facemceneplace: fotograf nuntă, fotograf botez și fotograf cununie în Ilfov și România. Lasă și tu o recenzie.";

export const Route = createFileRoute("/recenzii")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://facemceneplace.com/recenzii" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://facemceneplace.com/recenzii" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(reviewsQuery),
  errorComponent: () => (
    <div className="section-inner">
      <h1 className="font-display text-3xl">Recenziile nu s-au încărcat</h1>
      <Button variant="link" asChild>
        <Link to="/">Înapoi acasă</Link>
      </Button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="section-inner">
      <Button variant="link" asChild>
        <Link to="/">Înapoi acasă</Link>
      </Button>
    </div>
  ),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { data } = useSuspenseQuery(reviewsQuery);
  return (
    <main className="section-inner reviews-page">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-6">
        <Link to="/" className="wordmark min-w-0 truncate">
          <span className="text-primary">#</span>facemceneplace
        </Link>
        <Button variant="link" asChild className="shrink-0 px-0">
          <Link to="/" hash="recenzii">
            <ArrowLeft aria-hidden="true" />
            Înapoi acasă
          </Link>
        </Button>
      </header>
      <h1 className="section-title mt-10">
        Recenzii<span className="text-primary">.</span>
      </h1>
      <p className="text-sm text-muted-foreground">
        {data.reviews.length}{" "}
        {data.reviews.length === 1 ? "recenzie de la clienți" : "recenzii de la clienți"}
      </p>
      <div className="mt-6">
        <ReviewFacebookLink facebook={data.settings.facebook} />
      </div>
      <div className="mt-8 grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.reviews.map((review, index) => (
          <ReviewCard key={`${review.author}-${index}`} review={review} />
        ))}
      </div>
      <section id="scrie-recenzie" aria-label="Lasă o recenzie">
        <VisitorReviewForm />
      </section>
    </main>
  );
}
