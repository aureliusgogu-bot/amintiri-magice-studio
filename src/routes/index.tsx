import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDown, ArrowRight, Instagram, Facebook, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { ParallaxPhoto } from "@/components/parallax-photo";
import hero from "@/assets/hero.jpg.asset.json";

import storyPhoto from "@/assets/nunta/nunta-1-large.jpg";
import contactPhoto from "@/assets/nunta/nunta-7-large.jpg";

const title = "#facemceneplace — Foto și video de peste 20 de ani";
const description =
  "De peste 20 de ani, transformăm clipe în amintiri. Descoperă poveștile #facemceneplace: fotografie și video pentru nunți, botezuri, majorate și evenimente.";
export const Route = createFileRoute("/")({
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
  }),
  component: Index,
});
const facebook = "https://www.facebook.com/share/1FYnSYK1N4/";
const instagram = "https://www.instagram.com/george.constantin1701";
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
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
    <header className={`site-nav ${scrolled || open ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a className="wordmark" href="#acasa" aria-label="#facemceneplace — Acasă">
          <span className="hash">#</span>facemceneplace
        </a>
        <nav className="nav-links" aria-label="Navigație principală">
          {[
            ["Portofoliu", "portofoliu"],
            ["Despre", "despre"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
            <Button key={id} variant="nav" asChild>
              <a href={`#${id}`}>{label}</a>
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
          {[
            ["Portofoliu", "portofoliu"],
            ["Despre", "despre"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
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
  const [opened, setOpened] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    window.location.href = `mailto:facemceneplace@gmail.com?subject=${encodeURIComponent(`O nouă poveste — ${name}`)}&body=${encodeURIComponent(`Nume: ${name}\nEmail: ${email}\n\n${message}`)}`;
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
      <Button variant="studio" type="submit">
        Să începem povestea
        <ArrowUpRight />
      </Button>
      {opened && (
        <p role="status" className="text-sm text-muted-foreground">
          Continuă în aplicația ta de email. Mesajul va fi trimis doar după confirmarea ta.
        </p>
      )}
    </form>
  );
}
function Index() {
  return (
    <div id="studio-page">
      <Navigation />
      <main>
        <section id="acasa" className="hero">
          <ParallaxPhoto
            src={hero.url}
            alt="Un cuplu de miri, împreună în lumina caldă a apusului"
            className="hero-photo"
            distance={85}
            eager
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <p className="eyebrow">Fotografie & videografie · Povești cu suflet</p>
              <h1>#facemceneplace</h1>
              <p className="hero-subline mx-auto">
                De peste 20 de ani, transformăm clipe în amintiri.
              </p>
              <div className="hero-actions justify-center">
                <Button variant="studio" asChild>
                  <a href="#portofoliu">
                    Vezi portofoliul
                    <ArrowUpRight />
                  </a>
                </Button>
                <Button variant="cinematic" asChild>
                  <a href="#contact">
                    Contact
                    <ArrowRight />
                  </a>
                </Button>
              </div>
            </motion.div>
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
        <PortfolioGallery />
        <section id="despre" className="story-section">
          <div className="section-inner story-layout">
            <div className="story-intro">
              <p className="section-kicker">Din pasiune. Cu suflet.</p>
              <h2 className="section-title">
                Povestea
                <br />
                <em>noastră.</em>
              </h2>
              <div className="experience">
                <strong>20+</strong>
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
                <motion.p
                  key={index}
                  className="story-line"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7 }}
                >
                  {line.split("#facemceneplace").map((part, i) => (
                    <span key={i}>
                      {i > 0 && <span className="text-primary">#facemceneplace</span>}
                      {part}
                    </span>
                  ))}
                </motion.p>
              ))}
            </div>
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
              Hai să păstrăm împreună <em>momentul tău.</em>
            </h2>
            <div className="contact-layout">
              <div>
                <a className="email-link" href="mailto:facemceneplace@gmail.com">
                  facemceneplace@gmail.com
                  <ArrowUpRight size={20} />
                </a>
                <SocialLinks />
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p className="footer-brand">
          #facemceneplace <span>· © {new Date().getFullYear()}</span>
        </p>
        <SocialLinks />
      </footer>
    </div>
  );
}
