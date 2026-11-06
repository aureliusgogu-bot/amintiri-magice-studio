import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterCredit } from "@/components/footer-credit";
import { cn } from "@/lib/utils";
import { DEFAULT_SITE_DATA, type SiteData } from "@/lib/site-data";
import { trustPages, type TrustPageKey } from "@/lib/trust-pages";
import { whatsappHref } from "@/lib/contact-links";

/** Preview-only public information page; never part of the attached component library. */
export interface TrustPageProps extends ComponentPropsWithoutRef<"main"> {
  pageKey: TrustPageKey;
  data?: SiteData;
}

export const TrustPage = forwardRef<HTMLElement, TrustPageProps>(function TrustPage(
  { pageKey, data = DEFAULT_SITE_DATA, className, children, ...props }, ref,
) {
  const page = trustPages[pageKey];
  const { settings } = data;
  const whatsapp = whatsappHref(settings.people[0]?.phone);
  return <>
    <main ref={ref} className={cn("section-inner reviews-page", className)} {...props}>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <Link to="/" className="wordmark"><span className="text-primary">#</span>facemceneplace</Link>
        <Button variant="link" asChild><Link to="/"><ArrowLeft aria-hidden="true" />Înapoi acasă</Link></Button>
      </header>
      <h1 className="section-title mt-10">{page.heading}<span className="text-primary">.</span></h1>
      <div className="max-w-3xl space-y-6 text-foreground">
        {page.paragraphs.map((paragraph) => <p key={paragraph} className="leading-relaxed">{paragraph}</p>)}
        {pageKey === "contact" && <div className="space-y-4 border-t border-border pt-6">
          {settings.people.map((person) => <p key={person.phone}>{person.name} · <a className="text-primary underline" href={`tel:${person.phone.startsWith("+") ? person.phone : `+4${person.phone}`}`}>{person.phone}</a></p>)}
          <p><a className="text-primary underline" href={`mailto:${settings.email}`}>{settings.email}</a></p>
          <div className="flex flex-wrap gap-3">
            <Button variant="cinematic" asChild><Link to="/" hash="contact">Formular de contact</Link></Button>
            {whatsapp && <Button variant="cinematic" asChild><a href={whatsapp} target="_blank" rel="noopener noreferrer">Scrie-ne pe WhatsApp</a></Button>}
            <Button variant="link" asChild><a href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></Button>
            <Button variant="link" asChild><a href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></Button>
          </div>
        </div>}
        {pageKey === "privacy" && <p><a className="text-primary underline" href={`mailto:${settings.email}`}>{settings.email}</a></p>}
        {children}
      </div>
      <nav aria-label="Informații despre studio" className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-6">
        <Button variant="link" asChild><Link to="/about">Despre noi</Link></Button>
        <Button variant="link" asChild><Link to="/contact">Contact</Link></Button>
        <Button variant="link" asChild><Link to="/privacy">Confidențialitate</Link></Button>
        <Button variant="link" asChild><Link to="/recenzii">Recenzii</Link></Button>
        <Button variant="link" asChild><Link to="/" hash="portofoliu">Portofoliu</Link></Button>
      </nav>
    </main>
    <footer className="footer-credit-bar"><FooterCredit /></footer>
  </>;
});