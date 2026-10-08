import botez1small from "@/assets/botez/botez-1-small.jpg";
import botez1large from "@/assets/botez/botez-1-large.jpg";
import botez2small from "@/assets/botez/botez-2-small.jpg";
import botez2large from "@/assets/botez/botez-2-large.jpg";
import botez3small from "@/assets/botez/botez-3-small.jpg";
import botez3large from "@/assets/botez/botez-3-large.jpg";
import botez4small from "@/assets/botez/botez-4-small.jpg";
import botez4large from "@/assets/botez/botez-4-large.jpg";
import nunta1small from "@/assets/nunta/nunta-1-small.jpg";
import nunta1large from "@/assets/nunta/nunta-1-large.jpg";
import nunta2small from "@/assets/nunta/nunta-2-small.jpg";
import nunta2large from "@/assets/nunta/nunta-2-large.jpg";
import nunta3small from "@/assets/nunta/nunta-3-small.jpg";
import nunta3large from "@/assets/nunta/nunta-3-large.jpg";
import nunta4small from "@/assets/nunta/nunta-4-small.jpg";
import nunta4large from "@/assets/nunta/nunta-4-large.jpg";
import nunta5small from "@/assets/nunta/nunta-5-small.jpg";
import nunta5large from "@/assets/nunta/nunta-5-large.jpg";
import majorat1small from "@/assets/majorat/majorat-1-small.jpg";
import majorat1large from "@/assets/majorat/majorat-1-large.jpg";
import majorat2small from "@/assets/majorat/majorat-2-small.jpg";
import majorat2large from "@/assets/majorat/majorat-2-large.jpg";
import majorat3small from "@/assets/majorat/majorat-3-small.jpg";
import majorat3large from "@/assets/majorat/majorat-3-large.jpg";
import majorat4small from "@/assets/majorat/majorat-4-small.jpg";
import majorat4large from "@/assets/majorat/majorat-4-large.jpg";
import majorat5small from "@/assets/majorat/majorat-5-small.jpg";
import majorat5large from "@/assets/majorat/majorat-5-large.jpg";
import photo0small from "@/assets/photo-0-small.jpg.asset.json";
import photo0large from "@/assets/photo-0-large.jpg.asset.json";
import photo1small from "@/assets/photo-1-small.jpg.asset.json";
import photo1large from "@/assets/photo-1-large.jpg.asset.json";
import photo2small from "@/assets/photo-2-small.jpg.asset.json";
import photo2large from "@/assets/photo-2-large.jpg.asset.json";
import photo3small from "@/assets/photo-3-small.jpg.asset.json";
import photo3large from "@/assets/photo-3-large.jpg.asset.json";
import photo8small from "@/assets/photo-8-small.jpg.asset.json";
import photo8large from "@/assets/photo-8-large.jpg.asset.json";
import photo9small from "@/assets/photo-9-small.jpg.asset.json";
import photo9large from "@/assets/photo-9-large.jpg.asset.json";
import photo10small from "@/assets/photo-10-small.jpg.asset.json";
import photo10large from "@/assets/photo-10-large.jpg.asset.json";
import photo11small from "@/assets/photo-11-small.jpg.asset.json";
import photo11large from "@/assets/photo-11-large.jpg.asset.json";
import { useEffect, useRef, useState, useCallback, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion";

// Înlocuiți src și highRes cu fotografiile studioului; proporțiile păstrează stabilă compoziția.
export const photos = [
  {
    src: botez1small,
    highRes: botez1large,
    aspectRatio: 1.5,
    category: "Botez",
    title: "Pregătit pentru soare",
  },
  {
    src: botez2small,
    highRes: botez2large,
    aspectRatio: 1.5,
    category: "Botez",
    title: "Lumea de deasupra",
  },
  {
    src: botez3small,
    highRes: botez3large,
    aspectRatio: 0.67,
    category: "Botez",
    title: "Privire printre gratii",
  },
  {
    src: botez4small,
    highRes: botez4large,
    aspectRatio: 1.5,
    category: "Botez",
    title: "Cel mai mic star",
  },
  {
    src: nunta1small,
    highRes: nunta1large,
    aspectRatio: 0.67,
    category: "Nunți",
    title: "Tandrețe lângă apă",
  },
  {
    src: nunta2small,
    highRes: nunta2large,
    aspectRatio: 1.5,
    category: "Nunți",
    title: "Drumul spre fericire",
  },
  {
    src: nunta3small,
    highRes: nunta3large,
    aspectRatio: 1.5,
    category: "Nunți",
    title: "Mână în mână",
  },
  {
    src: nunta4small,
    highRes: nunta4large,
    aspectRatio: 1.5,
    category: "Nunți",
    title: "Privirea ei",
  },
  {
    src: nunta5small,
    highRes: nunta5large,
    aspectRatio: 1.5,
    category: "Nunți",
    title: "Împreună la drum",
  },
  {
    src: majorat1small,
    highRes: majorat1large,
    aspectRatio: 0.67,
    category: "Majorat",
    title: "Rochie de seară, lângă piscină",
  },
  {
    src: majorat2small,
    highRes: majorat2large,
    aspectRatio: 0.67,
    category: "Majorat",
    title: "Privire peste umăr",
  },
  {
    src: majorat3small,
    highRes: majorat3large,
    aspectRatio: 1.5,
    category: "Majorat",
    title: "Zâmbet de majorat",
  },
  {
    src: majorat4small,
    highRes: majorat4large,
    aspectRatio: 0.67,
    category: "Majorat",
    title: "Eleganță în mișcare",
  },
  {
    src: majorat5small,
    highRes: majorat5large,
    aspectRatio: 0.67,
    category: "Majorat",
    title: "Povești în foișor",
  },
  {
    src: photo0small.url,
    highRes: photo0large.url,
    aspectRatio: 0.78,
    category: "Nunți",
    title: "O promisiune pentru totdeauna",
  },
  {
    src: photo3small.url,
    highRes: photo3large.url,
    aspectRatio: 0.8,
    category: "Nunți",
    title: "Doar noi doi",
  },
  {
    src: photo8small.url,
    highRes: photo8large.url,
    aspectRatio: 1.2,
    category: "Evenimente",
    title: "O masă, o mie de povești",
  },
  {
    src: photo1small.url,
    highRes: photo1large.url,
    aspectRatio: 0.78,
    category: "Nunți",
    title: "Împreună, până la orizont",
  },
  {
    src: photo10small.url,
    highRes: photo10large.url,
    aspectRatio: 1.15,
    category: "Evenimente",
    title: "Oamenii care ne sunt acasă",
  },
  {
    src: photo2small.url,
    highRes: photo2large.url,
    aspectRatio: 0.85,
    category: "Nunți",
    title: "Începutul poveștii noastre",
  },
  {
    src: photo9small.url,
    highRes: photo9large.url,
    aspectRatio: 0.9,
    category: "Evenimente",
    title: "Ecoul unei seri",
  },
  {
    src: photo11small.url,
    highRes: photo11large.url,
    aspectRatio: 0.8,
    category: "Evenimente",
    title: "Bucuria de a fi împreună",
  },
];
type Photo = (typeof photos)[number];
function SafeImage({
  src,
  alt,
  className,
  onLoad,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return failed ? (
    <span role="img" aria-label={alt} className="absolute inset-0" />
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      onLoad={onLoad}
    />
  );
}
function PhotoCard({
  photo,
  enhanced,
  onOpen,
}: {
  photo: Photo;
  enhanced: boolean;
  onOpen: (photo: Photo, button: HTMLButtonElement) => void;
}) {
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 190, damping: 25 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 190, damping: 25 });
  const gx = useSpring(useTransform(mx, [-0.5, 0.5], [-90, 90]), { stiffness: 160, damping: 30 });
  const gy = useSpring(useTransform(my, [-0.5, 0.5], [-80, 80]), { stiffness: 160, damping: 30 });
  function move(event: MouseEvent<HTMLDivElement>) {
    if (!enhanced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }
  return (
    <motion.div
      className="photo-wrapper"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      onMouseMove={move}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div
        className="photo-shadow"
        animate={{
          opacity: enhanced && hover ? 1 : 0.15,
          scale: enhanced && hover ? 1.08 : 0.95,
          y: enhanced && hover ? 20 : 0,
        }}
        transition={{ duration: 0.35 }}
      />
      <motion.div
        className="photo-surface"
        {...(enhanced ? { layoutId: `photo-${photo.src}` } : {})}
        style={{
          aspectRatio: photo.aspectRatio,
          rotateX: enhanced ? rx : 0,
          rotateY: enhanced ? ry : 0,
        }}
        animate={
          enhanced ? { scale: hover ? 1.045 : 1, y: hover ? -12 : 0, z: hover ? 50 : 0 } : {}
        }
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <Button
          variant="photo"
          className="photo-button"
          aria-label={`Deschide fotografia: ${photo.title}`}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onClick={(event) => onOpen(photo, event.currentTarget)}
        >
          <SafeImage src={photo.src} alt={`${photo.title} — ${photo.category}`} />
          <motion.div
            className="photo-info"
            initial={false}
            animate={{ opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <Maximize2 size={16} className="photo-expand" />
            <h3>{photo.title}</h3>
            <span>{photo.category}</span>
          </motion.div>
        </Button>
        {enhanced && (
          <motion.div
            className="photo-glare"
            style={{ x: gx, y: gy }}
            animate={{ opacity: hover ? 1 : 0 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
function PhotoColumn({
  items,
  index,
  enhanced,
  scrollProgress,
  drift,
  onOpen,
}: {
  items: Photo[];
  index: number;
  enhanced: boolean;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  drift: ReturnType<typeof useMotionValue<number>>;
  onOpen: (photo: Photo, button: HTMLButtonElement) => void;
}) {
  const speed = [0.4, 1.3, 0.8, 1.7][index] ?? 1;
  const y = useTransform(scrollProgress, [0, 1], [100 * speed, -220 * speed]);
  const x = useSpring(useTransform(drift, [-0.5, 0.5], [-28 * speed, 28 * speed]), {
    stiffness: 90,
    damping: 30,
  });
  return (
    <motion.div
      className="gallery-column"
      data-depth={enhanced ? index : undefined}
      data-speed={enhanced ? speed : undefined}
      style={enhanced ? { y, x } : {}}
    >
      {items.map((photo) => (
        <PhotoCard key={photo.src} photo={photo} enhanced={enhanced} onOpen={onOpen} />
      ))}
    </motion.div>
  );
}
function GalleryLight({
  index,
  scrollProgress,
  drift,
}: {
  index: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  drift: ReturnType<typeof useMotionValue<number>>;
}) {
  const speed = index === 0 ? 0.08 : 0.16;
  const y = useTransform(scrollProgress, [0, 1], [20 * speed, -220 * speed]);
  const x = useSpring(useTransform(drift, [-0.5, 0.5], [-28 * speed, 28 * speed]), {
    stiffness: 60,
    damping: 30,
  });
  return (
    <motion.div
      aria-hidden="true"
      className={`gallery-light gallery-light-${index}`}
      style={{ x, y }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
    />
  );
}
function Lightbox({
  selected,
  list,
  enhanced,
  onClose,
  onSelect,
}: {
  selected: Photo;
  list: Photo[];
  enhanced: boolean;
  onClose: () => void;
  onSelect: (photo: Photo) => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const [sharp, setSharp] = useState(false);
  const index = list.indexOf(selected);
  const next = useCallback(
    (direction: number) => {
      const photo = list[(index + direction + list.length) % list.length];
      if (photo) onSelect(photo);
    },
    [index, list, onSelect],
  );
  useEffect(() => setSharp(false), [selected.src]);
  useEffect(() => {
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = document.getElementById("studio-page");
    background?.setAttribute("inert", "");
    const timer = window.setTimeout(
      () => dialog.current?.querySelector<HTMLButtonElement>("button")?.focus(),
      20,
    );
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = oldOverflow;
      background?.removeAttribute("inert");
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        next(-1);
      }
      if (event.key === "Tab") {
        const controls = dialog.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!controls?.length) return;
        const first = controls[0],
          last = controls[controls.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [next, onClose]);
  return (
    <motion.div
      className="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`Fotografie: ${selected.title}`}
        className="lightbox-dialog"
      >
        <motion.div
          className="lightbox-image"
          {...(enhanced ? { layoutId: `photo-${selected.src}` } : {})}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
        >
          <SafeImage src={selected.src} alt={selected.title} eager />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: sharp ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <SafeImage
              key={selected.highRes}
              src={selected.highRes}
              alt={`${selected.title} — fotografie de înaltă rezoluție`}
              eager
              onLoad={() => setSharp(true)}
            />
          </motion.div>
        </motion.div>
        <Button
          variant="lightbox"
          size="icon"
          className="lightbox-close"
          aria-label="Închide fotografia"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        >
          <X />
        </Button>
        <Button
          variant="lightbox"
          size="icon"
          className="lightbox-prev"
          aria-label="Fotografia anterioară"
          onClick={(event) => {
            event.stopPropagation();
            next(-1);
          }}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="lightbox"
          size="icon"
          className="lightbox-next"
          aria-label="Fotografia următoare"
          onClick={(event) => {
            event.stopPropagation();
            next(1);
          }}
        >
          <ArrowRight />
        </Button>
        <div className="lightbox-caption" aria-live="polite">
          <h3>{selected.title}</h3>
          <p>
            {selected.category} · {String(index + 1).padStart(2, "0")} /{" "}
            {String(list.length).padStart(2, "0")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
export function PortfolioGallery() {
  const enhanced = useEnhancedMotion();
  const section = useRef<HTMLDivElement>(null);
  const source = useRef<HTMLButtonElement | null>(null);
  const [category, setCategory] = useState("Toate");
  const [selected, setSelected] = useState<Photo | null>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const drift = useMotionValue(0);
  const list =
    category === "Toate" ? photos : photos.filter((photo) => photo.category === category);
  const columns = Array.from({ length: enhanced ? 4 : 2 }, (_, column) =>
    list.filter((_, index) => index % (enhanced ? 4 : 2) === column),
  );
  const close = useCallback(() => {
    setSelected(null);
    window.setTimeout(() => source.current?.focus(), 300);
  }, []);
  function open(photo: Photo, button: HTMLButtonElement) {
    source.current = button;
    setSelected(photo);
  }
  return (
    <LayoutGroup id="studio-gallery">
      <section id="portofoliu" className="section-inner" ref={section}>
        <div className="portfolio-top">
          <div>
            <p className="section-kicker">Povești în imagini</p>
            <h2 className="section-title">
              Portofoliu<span className="text-primary">.</span>
            </h2>
            <p className="portfolio-description">Clipe care trec. Emoții care rămân.</p>
          </div>
          <div className="filters" role="group" aria-label="Categorii de fotografii">
            {["Toate", "Nunți", "Botez", "Majorat", "Evenimente"].map((item) => (
              <Button
                key={item}
                variant="nav"
                data-active={category === item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div
          className="gallery-wall"
          onMouseMove={(event) => {
            if (!enhanced) return;
            const rect = event.currentTarget.getBoundingClientRect();
            drift.set((event.clientX - rect.left) / rect.width - 0.5);
          }}
          onMouseLeave={() => drift.set(0)}
        >
          {enhanced &&
            [0, 1].map((index) => (
              <GalleryLight
                key={index}
                index={index}
                scrollProgress={scrollYProgress}
                drift={drift}
              />
            ))}
          <div className={`gallery-columns ${enhanced ? "" : "gallery-simple"}`}>
            {columns.map((items, index) => (
              <PhotoColumn
                key={`${category}-${index}-${enhanced}`}
                items={items}
                index={index}
                enhanced={enhanced}
                scrollProgress={scrollYProgress}
                drift={drift}
                onOpen={open}
              />
            ))}
          </div>
        </div>
        <div className="gallery-end">
          {String(list.length).padStart(2, "0")} povești. Nenumărate emoții.
        </div>
      </section>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <Lightbox
                selected={selected}
                list={list}
                enhanced={enhanced}
                onClose={close}
                onSelect={setSelected}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </LayoutGroup>
  );
}
