import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Instagram,
  Facebook,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioGallery, photos } from "@/components/portfolio-gallery";
import { PortfolioRecommender } from "@/components/portfolio-recommender";
import { ParallaxPhoto } from "@/components/parallax-photo";
import {
  CountUp,
  CursorRing,
  EASE,
  Magnetic,
  Marquee,
  MaskReveal,
  Reveal,
  ScrollProgress,
} from "@/components/motion-kit";
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion";
import hero from "@/assets/hero.jpg.asset.json";
import { DEFAULT_SITE_DATA, SiteContext, useSite } from "@/lib/site-data";
import { getSiteData } from "@/lib/site-data.functions";

import storyPhoto from "@/assets/nunta/nunta-1-large.jpg";
import contactPhoto from "@/assets/nunta/nunta-7-large.jpg";
import instagramQr from "@/assets/qr/instagram-qr.jpg";

const title = "#facemceneplace — Foto și video de peste 20 de ani";
const description =
  "De peste 20 de ani, transformăm clipe în amintiri. Descoperă poveștile #facemceneplace: fotografie și video pentru nunți, cununii civile, botezuri, majorate și evenimente, cu sediul în Ilfov și deplasări în toată țara.";

// Public origin of the site, so every structured-data image URL is absolute.
const SITE_ORIGIN = "https://facemceneplace.ro";
const BUSINESS_ID = `${SITE_ORIGIN}/#facemceneplace`;
const heroAlt = "Un cuplu de miri, împreună în lumina caldă a apusului";

// Images the page really shows: the hero plus every gallery photo, described with
// the same Romanian titles and categories visitors see.
const imageObjects = [
  {
    "@type": "ImageObject",
    contentUrl: new URL(hero.url, SITE_ORIGIN).href,
    caption: heroAlt,
    name: "#facemceneplace",
    creator: { "@id": BUSINESS_ID },
  },
  ...photos.map((photo) => ({
    "@type": "ImageObject",
    contentUrl: new URL(photo.highRes, SITE_ORIGIN).href,
    thumbnailUrl: new URL(photo.src, SITE_ORIGIN).href,
    name: photo.title,
    caption: `${photo.title} — ${photo.category}`,
    creator: { "@id": BUSINESS_ID },
  })),
];
export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "Photographer"],
          "@id": BUSINESS_ID,
          name: "#facemceneplace",
          description,
          url: `${SITE_ORIGIN}/`,
          email: "facemceneplace@gmail.com",
          areaServed: { "@type": "Country", name: "România" },
          address: { "@type": "PostalAddress", addressRegion: "Ilfov", addressCountry: "RO" },
          telephone: ["+40727113893", "+40720179744"],
          sameAs: [
            "https://www.facebook.com/share/1BagDkJcXJ/",
            "https://www.instagram.com/george.constantin1701",
          ],
          employee: [
            { "@type": "Person", name: "George Constantin" },
            { "@type": "Person", name: "Petrișor Stan" },
          ],
          image: imageObjects,
        }),
      },
    ],
  }),
  loader: async () => {
    try {
      return await getSiteData();
    } catch {
      return null;
    }
  },
  component: Index,
});
const navItems = [
  ["Portofoliu", "portofoliu"],
  ["Despre", "despre"],
  ["Recenzii", "recenzii"],
  ["Contact", "contact"],
] as const;
const phoneLabel = (phone: string) => `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
const phoneHref = (phone: string) => `tel:+4${phone}`;
const story = [
  "De peste 20 de ani, nu doar fotografiem și filmăm.",
  "Păstrăm emoții. Păstrăm povești. Păstrăm oameni.",
  "În tot acest timp, am învățat că cele mai frumoase momente nu se repetă.",
  "Un zâmbet, o privire, o îmbrățișare, o lacrimă de fericire… sunt clipe care trec într-o secundă, dar care pot rămâne pentru o viață.",
  "📸 Foto și 🎥 video pentru noi înseamnă mai mult decât imagini perfecte.",
  "Înseamnă să fim acolo, să simțim momentul și să-l transformăm într-o amintire pe care să o retrăiești peste ani cu aceeași emoție.",
  "De peste 20 de ani, facem ceea ce iubim.",
  "Cu pasiune. Cu suflet. Cu respect pentru fiecare poveste care ne este încredințată.",
  "Iar #facemceneplace nu este doar un hashtag.",
  "Este felul nostru de a fi.",
  "Este povestea noastră.",
  "Este ceea ce ne reprezintă.",
  "Pentru că atunci când faci ceea ce îți place, se vede în fiecare fotografie, în fiecare cadru și în fiecare poveste pe care o lași în urmă.",
  "#facemceneplace ❤️",
  "De peste 20 de ani, transformăm clipe în amintiri.",
];
function SocialLinks() {
  const { facebook, instagram } = useSite().settings;
  return (
    <div className="social-links">
      <Button variant="nav" asChild>
        <a href={facebook} target="_blank" rel="noopener noreferrer">
          <Facebook size={14} />
          Facebook
          <ArrowUpRight size={13} />
        </a>
      </Button>
      <Button variant="nav" asChild>
        <a href={instagram} target="_blank" rel="noopener noreferrer">
          <Instagram size={14} />
          Instagram
          <ArrowUpRight size={13} />
        </a>
      </Button>
    </div>
  );
}
function Navigation() {
  const { facebook, instagram } = useSite().settings;
  const enhanced = useEnhancedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    let last = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      // Slide away while reading down the page, come back the moment the visitor scrolls up.
      if (Math.abs(y - last) > 6) {
        setHidden(y > 240 && y > last);
        last = y;
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const sections = navItems
      .map(([, id]) => id)
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);
  return (
    <header
      className={`site-nav ${scrolled || open ? "scrolled" : ""} ${enhanced && hidden && !open ? "is-hidden" : ""}`}
    >
      <div className="nav-inner">
        <a className="wordmark" href="#acasa" aria-label="#facemceneplace — Acasă">
          <span className="hash">#</span>facemceneplace
        </a>
        <nav className="nav-links" aria-label="Navigație principală">
          {navItems.map(([label, id]) => (
            <Button key={id} variant="nav" asChild>
              <a href={`#${id}`} className="nav-link" data-active={active === id}>
                {label}
              </a>
            </Button>
          ))}
          <span className="social-divider" />
          <Button variant="nav" size="icon" asChild>
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </Button>
          <Button variant="nav" size="icon" asChild>
            <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={16} />
            </a>
          </Button>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="mobile-toggle"
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={open}
          aria-controls="meniu-mobil"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav id="meniu-mobil" className="mobile-menu" aria-label="Navigație mobilă">
          {navItems.map(([label, id]) => (
            <Button variant="nav" key={id} asChild>
              <a href={`#${id}`} onClick={() => setOpen(false)}>
                {label}
              </a>
            </Button>
          ))}
          <SocialLinks />
        </nav>
      )}
    </header>
  );
}
function ContactForm() {
  const { email: studioEmail } = useSite().settings;
  const [opened, setOpened] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    window.location.href = `mailto:${studioEmail}?subject=${encodeURIComponent(`O nouă poveste — ${name}`)}&body=${encodeURIComponent(`Nume: ${name}\nEmail: ${email}\n\n${message}`)}`;
    setOpened(true);
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Numele tău
          <input
            name="name"
            autoComplete="name"
            placeholder="Nume și prenume"
            required
            maxLength={150}
          />
        </label>
        <label>
          Adresa de email
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nume@exemplu.ro"
            required
            maxLength={200}
          />
        </label>
      </div>
      <label>
        Povestește-ne despre momentul tău
        <textarea
          name="message"
          placeholder="Ce amintire vrei să păstrăm?"
          required
          maxLength={4000}
        />
      </label>
      <Magnetic>
        <Button variant="studio" type="submit">
          Să începem povestea
          <ArrowUpRight />
        </Button>
      </Magnetic>
      {opened && (
        <p role="status" className="text-sm text-muted-foreground">
          Continuă în aplicația ta de email. Mesajul va fi trimis doar după confirmarea ta.
        </p>
      )}
    </form>
  );
}
function HeroText() {
  const { people, locationHero } = useSite().settings;
  const enhanced = useEnhancedMotion();
  const item = (delay: number) => ({
    initial: { opacity: 0, y: enhanced ? 26 : 0 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: enhanced ? 1.1 : 0.6, delay: enhanced ? delay : 0, ease: EASE },
  });
  return (
    <div>
      <motion.p className="eyebrow" {...item(0.15)}>
        Fotografie & videografie · Povești cu suflet
      </motion.p>
      <motion.h1 {...item(0.3)}>#facemceneplace</motion.h1>
      <motion.p className="hero-subline mx-auto" {...item(0.55)}>
        De peste 20 de ani, transformăm clipe în amintiri.
      </motion.p>
      <motion.div className="hero-actions justify-center" {...item(0.75)}>
        <Magnetic>
          <Button variant="studio" asChild>
            <a href="#portofoliu">
              Vezi portofoliul
              <ArrowUpRight />
            </a>
          </Button>
        </Magnetic>
        <Magnetic>
          <Button variant="cinematic" asChild>
            <a href="#contact">
              Contact
              <ArrowRight />
            </a>
          </Button>
        </Magnetic>
      </motion.div>
      <motion.div className="hero-contacts" {...item(0.95)}>
        {people.map((person) => (
          <a key={person.phone} href={phoneHref(person.phone)}>
            <span>{person.name}</span>
            <strong>{phoneLabel(person.phone)}</strong>
          </a>
        ))}
      </motion.div>
      <motion.p className="hero-location" {...item(1.1)}>
        <MapPin size={13} aria-hidden /> {locationHero}
      </motion.p>
    </div>
  );
}
function StoryLine({ line }: { line: string }) {
  const enhanced = useEnhancedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  // The line in the middle of the screen is lit; the rest rest at lower brightness.
  const focused = useInView(ref, { margin: "-38% 0px -38% 0px" });
  return (
    <motion.p
      ref={ref}
      className="story-line"
      initial={{ opacity: 0, y: enhanced ? 22 : 0 }}
      animate={{
        opacity: !seen ? 0 : enhanced && !focused ? 0.6 : 1,
        y: seen ? 0 : enhanced ? 22 : 0,
      }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {line.split("#facemceneplace").map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="text-primary">#facemceneplace</span>}
          {part}
        </span>
      ))}
    </motion.p>
  );
}
function Index() {
  const data = Route.useLoaderData();
  return (
    <SiteContext.Provider value={data ?? DEFAULT_SITE_DATA}>
      <Page />
    </SiteContext.Provider>
  );
}
function Page() {
  const { settings, reviews, photos: dbPhotos } = useSite();
  const { people, facebook, instagram, email } = settings;
  return (
    <div id="studio-page">
      <ScrollProgress />
      <CursorRing />
      <span aria-hidden className="film-grain" />
      <Navigation />
      <main>
        <section id="acasa" className="hero">
          <ParallaxPhoto src={hero.url} alt={heroAlt} className="hero-photo" distance={85} eager />
          <div className="hero-overlay" />
          <div className="hero-content">
            <HeroText />
          </div>
          <div className="hero-bottom">
            <p>
              Mai mult decât imagini.
              <br />
              Emoții, pentru o viață.
            </p>
            <p>
              Foto · Video
              <br />
              Din pasiune, cu suflet.
            </p>
          </div>
          <a className="scroll-mark" href="#portofoliu" aria-label="Descoperă portofoliul">
            <span>Descoperă</span>
            <ArrowDown size={13} />
            <i />
          </a>
        </section>
        <Marquee
          items={["Nunți", "Cununii civile", "Botezuri", "Majorate", "Evenimente", "Foto", "Video"]}
        />
        <PortfolioGallery items={dbPhotos ?? photos} />
        <PortfolioRecommender items={dbPhotos ?? photos} />
        <section id="despre" className="story-section">
          <div className="section-inner story-layout">
            <div className="story-intro">
              <p className="section-kicker">Din pasiune. Cu suflet.</p>
              <h2 className="section-title">
                <MaskReveal as="div">Povestea</MaskReveal>
                <MaskReveal as="div" delay={0.12}>
                  <em>noastră.</em>
                </MaskReveal>
              </h2>
              <div className="experience">
                <CountUp to={20} suffix="+" />
                <p>ani de amintiri</p>
              </div>
              <ParallaxPhoto
                src={storyPhoto}
                alt="Miri îmbrățișați lângă apă, fotografie alb-negru"
                className="story-photo"
                distance={45}
              />
            </div>
            <div className="story-copy">
              {story.map((line, index) => (
                <StoryLine key={index} line={line} />
              ))}
            </div>
          </div>
        </section>
        <section id="recenzii" className="reviews-section">
          <div className="section-inner">
            <p className="section-kicker">Cuvintele celor dragi</p>
            <h2 className="section-title">
              <MaskReveal as="div">
                Recenzii<span className="text-primary">.</span>
              </MaskReveal>
            </h2>
            {reviews.length > 0 ? (
              <div className="reviews-grid">
                {reviews.map((review, index) => (
                  <Reveal key={`${review.author}-${index}`} delay={index * 0.1}>
                    <figure className="review-card">
                      <blockquote>{review.quote}</blockquote>
                      <figcaption>
                        <strong>{review.author}</strong>
                        <span>{review.event}</span>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            ) : null}
            <Reveal className="reviews-cta">
              <p>
                Părerea celor pentru care am păstrat momentele contează cel mai mult. Citește
                recenziile lor pe pagina noastră de Facebook.
              </p>
              <Magnetic>
                <Button variant="cinematic" asChild>
                  <a href={facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook size={16} />
                    Citește recenziile pe Facebook
                    <ArrowUpRight />
                  </a>
                </Button>
              </Magnetic>
            </Reveal>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <ParallaxPhoto
            src={contactPhoto}
            alt="Verighete agățate de un ornament din fier forjat"
            className="contact-photo"
            distance={0}
          />
          <div className="section-inner">
            <p className="section-kicker">Fiecare poveste începe cu un salut</p>
            <h2 className="section-title contact-title">
              <MaskReveal as="div">Hai să păstrăm împreună</MaskReveal>
              <MaskReveal as="div" delay={0.12}>
                <em>momentul tău.</em>
              </MaskReveal>
            </h2>
            <Reveal className="contact-intro">
              <p>
                Fiecare poveste e diferită, așa că oferta și prețurile le stabilim împreună, în
                funcție de eveniment. Sună-ne sau scrie-ne și îți răspundem personal.
              </p>
              <p className="contact-location">
                <MapPin size={14} aria-hidden /> {settings.locationContact}
              </p>
            </Reveal>
            <Reveal className="contact-layout">
              <div>
                <ul className="contact-people">
                  {people.map((person) => (
                    <li key={person.phone}>
                      <span>{person.name}</span>
                      <a href={phoneHref(person.phone)}>
                        {phoneLabel(person.phone)}
                        <ArrowUpRight size={18} />
                      </a>
                    </li>
                  ))}
                </ul>
                <a className="email-link" href={`mailto:${email}`}>
                  {email}
                  <ArrowUpRight size={20} />
                </a>
                <SocialLinks />
                <a
                  className="qr-card"
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Deschide Instagram @george.constantin1701"
                >
                  <img
                    src={instagramQr}
                    alt="Cod QR pentru Instagram @george.constantin1701"
                    width={176}
                    height={176}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>
                    Scanează și urmărește-ne
                    <br />
                    pe Instagram
                  </span>
                </a>
              </div>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p className="footer-brand">
          #facemceneplace <span>· © {new Date().getFullYear()}</span>
        </p>
        <p className="footer-phones">
          {people.map((person) => (
            <a key={person.phone} href={phoneHref(person.phone)}>
              {person.name} · {phoneLabel(person.phone)}
            </a>
          ))}
        </p>
        <SocialLinks />
      </footer>
    </div>
  );
}
