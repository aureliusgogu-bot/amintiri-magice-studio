import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion";
import { EASE, MaskReveal, Reveal } from "@/components/motion-kit";
import { orderedCategories, type GalleryPhoto } from "@/lib/site-data";

const blurbs: Record<string, string> = {
  Nunți:
    "Ziua în care două povești devin una. Fiecare privire, fiecare lacrimă, păstrate exact cum le-ai simțit.",
  "Cununie civilă":
    "Un „da” rostit în fața celor dragi. Sobru, emoționant, scurt cât o respirație.",
  Botez: "Prima mare sărbătoare a unui om mic. Zâmbete, lumânări și bunici fericiți.",
  Majorat: "Începutul vieții de adult, într-o seară de neuitat.",
  Evenimente: "Petreceri, aniversări, ocazii speciale. Orice clipă care merită păstrată.",
};
const fallbackBlurb = "Clipe adevărate, surprinse cu răbdare și cu suflet.";

type Chapter = { name: string; blurb: string; photos: GalleryPhoto[] };

function buildChapters(items: GalleryPhoto[]): Chapter[] {
  return orderedCategories(items)
    .map((name) => ({
      name,
      blurb: blurbs[name] ?? fallbackBlurb,
      photos: items.filter((photo) => photo.category === name).slice(0, 3),
    }))
    .filter((chapter) => chapter.photos.length > 0)
    .slice(0, 5);
}

const pad = (n: number) => String(n + 1).padStart(2, "0");

/** Scroll-pinned film: the stage stays on screen while each chapter of the portfolio dissolves into the next. */
function PinnedStage({ chapters }: { chapters: Chapter[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(chapters.length - 1, Math.max(0, Math.floor(progress * chapters.length)));
    setActive((current) => (current === next ? current : next));
  });
  // Each chapter's photo drifts slowly while the scroll position moves through it.
  const drift = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const chapter = chapters[active] ?? chapters[0];
  const cover = chapter?.photos[0];
  if (!chapter || !cover) return null;
  return (
    <div
      ref={track}
      className="chapters-track"
      style={{ height: `${chapters.length * 90 + 40}svh` }}
    >
      <div className="chapters-stage">
        <AnimatePresence mode="sync">
          <motion.div
            key={chapter.name}
            className="chapters-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <motion.img
              src={cover.highRes}
              alt={`${cover.title} — ${chapter.name}`}
              style={{ y: drift, scale }}
              decoding="async"
            />
          </motion.div>
        </AnimatePresence>
        <div className="chapters-shade" aria-hidden />
        <div className="chapters-copy">
          <p className="chapters-count" aria-hidden>
            <span>{pad(active)}</span> / {pad(chapters.length - 1)}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <h3 className="chapters-name">{chapter.name}</h3>
              <p className="chapters-blurb">{chapter.blurb}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="chapters-thumbs" aria-hidden>
          {chapter.photos.slice(1).map((photo) => (
            <motion.img
              key={photo.highRes}
              src={photo.src}
              alt=""
              loading="lazy"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            />
          ))}
        </div>
        <ol className="chapters-rail" aria-label="Capitole">
          {chapters.map((c, index) => (
            <li key={c.name} data-active={index === active}>
              <span>{c.name}</span>
              <i />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Mobile / reduced motion: the same chapters as simple, calm stacked cards. */
function StackedChapters({ chapters }: { chapters: Chapter[] }) {
  return (
    <div className="chapters-stack">
      {chapters.map((chapter, index) => (
        <Reveal key={chapter.name} className="chapters-card">
          <img
            src={chapter.photos[0]?.src}
            alt={`${chapter.photos[0]?.title ?? ""} — ${chapter.name}`}
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className="chapters-count">{pad(index)}</p>
            <h3 className="chapters-name">{chapter.name}</h3>
            <p className="chapters-blurb">{chapter.blurb}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ChaptersScroll({ items }: { items: GalleryPhoto[] }) {
  const enhanced = useEnhancedMotion();
  const chapters = useMemo(() => buildChapters(items), [items]);
  if (chapters.length < 2) return null;
  return (
    <section id="capitole" className="chapters-section" aria-label="Capitolele poveștilor noastre">
      <div className="chapters-intro">
        <Reveal>
          <p className="section-kicker">Ce povestim</p>
        </Reveal>
        <h2 className="section-title">
          <MaskReveal as="div">Fiecare eveniment,</MaskReveal>
          <MaskReveal as="div" delay={0.12}>
            <em>un capitol.</em>
          </MaskReveal>
        </h2>
      </div>
      {enhanced ? <PinnedStage chapters={chapters} /> : <StackedChapters chapters={chapters} />}
    </section>
  );
}

const railItems = [
  ["acasa", "Acasă"],
  ["portofoliu", "Portofoliu"],
  ["capitole", "Capitole"],
  ["despre", "Despre"],
  ["recenzii", "Recenzii"],
  ["contact", "Contact"],
] as const;

/** Fixed dot index on the right edge. Desktop only; blends with whatever it sits over. */
export function SectionRail() {
  const enhanced = useEnhancedMotion();
  const [active, setActive] = useState("acasa");
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    const mid = window.innerHeight / 2;
    let current = railItems[0][0] as string;
    for (const [id] of railItems) {
      const element = document.getElementById(id);
      if (element && element.getBoundingClientRect().top <= mid) current = id;
    }
    setActive((previous) => (previous === current ? previous : current));
  });
  if (!enhanced) return null;
  return (
    <nav className="section-rail" aria-label="Secțiuni">
      {railItems.map(([id, label]) => (
        <a key={id} href={`#${id}`} data-active={active === id} aria-label={label}>
          <span>{label}</span>
          <i />
        </a>
      ))}
    </nav>
  );
}
