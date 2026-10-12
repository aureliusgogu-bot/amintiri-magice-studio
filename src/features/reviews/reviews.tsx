import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, ArrowUpRight, Facebook, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion";
import type { Review } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export interface ReviewCardProps extends HTMLAttributes<HTMLElement> {
  review: Review;
  variant?: "compact" | "full";
}

export const ReviewCard = forwardRef<HTMLElement, ReviewCardProps>(
  ({ review, variant = "full", className, ...props }, ref) => (
    <figure
      ref={ref}
      className={cn(
        "m-0 flex min-w-0 flex-col border border-border bg-card p-6",
        variant === "compact" ? "h-84 gap-3" : "h-auto gap-5",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="h-6 shrink-0 font-display text-5xl text-primary">
        “
      </span>
      <blockquote
        className={cn(
          "m-0 whitespace-pre-wrap break-words font-display text-lg italic leading-7",
          variant === "compact" && "line-clamp-5 h-35 shrink-0",
        )}
      >
        {review.quote}
      </blockquote>
      {variant === "compact" && (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="link" size="sm" className="h-auto self-start p-0">
              Citește mai mult
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-background/90" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-border bg-card p-6 sm:p-8">
              <Dialog.Title className="pr-10 font-display text-2xl text-primary">
                {review.author}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                {review.event || "Recenzie de la client"}
              </Dialog.Description>
              <blockquote className="mt-6 whitespace-pre-wrap break-words font-display text-xl italic leading-relaxed">
                {review.quote}
              </blockquote>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-3"
                  aria-label="Închide recenzia"
                  title="Închide recenzia"
                >
                  <X aria-hidden="true" />
                </Button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
      <figcaption className="mt-auto min-w-0 border-t border-border pt-4 text-sm">
        <strong className="block break-words font-medium text-primary">{review.author}</strong>
        <span className="mt-1 block break-words text-muted-foreground">{review.event}</span>
      </figcaption>
    </figure>
  ),
);

export interface ReviewFacebookLinkProps {
  facebook: string;
}

export function ReviewFacebookLink({ facebook }: ReviewFacebookLinkProps) {
  return (
    <Button
      variant="link"
      asChild
      className="h-auto max-w-full whitespace-normal px-0 text-center text-sm"
    >
      <a href={facebook} target="_blank" rel="noopener noreferrer">
        <Facebook aria-hidden="true" />
        Citește recenziile pe Facebook
        <ArrowUpRight aria-hidden="true" />
      </a>
    </Button>
  );
}

export interface HomepageReviewsProps extends HTMLAttributes<HTMLElement> {
  reviews: Review[];
  facebook: string;
}

export const HomepageReviews = forwardRef<HTMLElement, HomepageReviewsProps>(
  ({ reviews, facebook, className, ...props }, ref) => {
    const enhanced = useEnhancedMotion();
    const [carouselRef, api] = useEmblaCarousel({
      align: "start",
      slidesToScroll: "auto",
      duration: enhanced ? 30 : 0,
    });
    const [selected, setSelected] = useState(0);
    const [snaps, setSnaps] = useState<number[]>([]);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);
    useEffect(() => {
      if (!api) return;
      const update = () => {
        setSelected(api.selectedScrollSnap());
        setSnaps(api.scrollSnapList());
        setPrevious(api.canScrollPrev());
        setNext(api.canScrollNext());
      };
      update();
      api.on("select", update);
      api.on("reInit", update);
      return () => {
        api.off("select", update);
        api.off("reInit", update);
      };
    }, [api]);
    return (
      <section ref={ref} id="recenzii" className={cn("reviews-section", className)} {...props}>
        <div className="section-inner reviews-compact-inner">
          <p className="section-kicker">Cuvintele celor dragi</p>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <h2 className="section-title">
                Recenzii<span className="text-primary">.</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {reviews.length}{" "}
                {reviews.length === 1 ? "recenzie de la clienți" : "recenzii de la clienți"}
              </p>
            </div>
            {reviews.length > 0 && (
              <div className="hidden shrink-0 gap-2 md:flex">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!previous}
                  onClick={() => api?.scrollPrev()}
                  aria-label="Recenziile anterioare"
                  title="Recenziile anterioare"
                >
                  <ArrowLeft aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!next}
                  onClick={() => api?.scrollNext()}
                  aria-label="Recenziile următoare"
                  title="Recenziile următoare"
                >
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>
          {reviews.length > 0 && (
            <div
              role="region"
              aria-roledescription="carusel"
              aria-label="Recenzii de la clienți"
              className="mt-6"
            >
              <div ref={carouselRef} className="overflow-hidden">
                <div className="-ml-4 flex touch-pan-y">
                  {reviews.map((review, index) => (
                    <div
                      key={`${review.author}-${index}`}
                      role="group"
                      aria-roledescription="diapozitiv"
                      aria-label={`${index + 1} din ${reviews.length}`}
                      className="min-w-0 shrink-0 basis-full pl-4 md:basis-1/3"
                    >
                      <ReviewCard
                        review={review}
                        variant="compact"
                        onFocusCapture={() => {
                          if (api && !api.slidesInView().includes(index))
                            api.scrollTo(
                              Math.floor(index / (window.innerWidth >= 768 ? 3 : 1)),
                              true,
                            );
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="mt-3 hidden items-center justify-center gap-1 md:flex"
                aria-label="Paginile recenziilor"
              >
                {snaps.map((_, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Pagina ${index + 1} de recenzii`}
                    aria-current={selected === index ? "true" : undefined}
                    onClick={() => api?.scrollTo(index)}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        selected === index ? "bg-primary" : "bg-muted-foreground/40",
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button variant="cinematic" asChild>
                <Link to="/recenzii">
                  Vezi toate recenziile
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="link" asChild className="px-0">
                <Link to="/recenzii" hash="scrie-recenzie">
                  Lasă o recenzie
                </Link>
              </Button>
            </div>
            <ReviewFacebookLink facebook={facebook} />
          </div>
        </div>
      </section>
    );
  },
);
