import cununie5small from "@/assets/cununie/cununie-5-small.jpg";
import cununie5large from "@/assets/cununie/cununie-5-large.jpg";
import cununie6small from "@/assets/cununie/cununie-6-small.jpg";
import cununie6large from "@/assets/cununie/cununie-6-large.jpg";
import cununie7small from "@/assets/cununie/cununie-7-small.jpg";
import cununie7large from "@/assets/cununie/cununie-7-large.jpg";
import cununie8small from "@/assets/cununie/cununie-8-small.jpg";
import cununie8large from "@/assets/cununie/cununie-8-large.jpg";
import cununie9small from "@/assets/cununie/cununie-9-small.jpg";
import cununie9large from "@/assets/cununie/cununie-9-large.jpg";
import cununie1small from "@/assets/cununie/cununie-1-small.jpg";
import cununie1large from "@/assets/cununie/cununie-1-large.jpg";
import cununie2small from "@/assets/cununie/cununie-2-small.jpg";
import cununie2large from "@/assets/cununie/cununie-2-large.jpg";
import cununie3small from "@/assets/cununie/cununie-3-small.jpg";
import cununie3large from "@/assets/cununie/cununie-3-large.jpg";
import cununie4small from "@/assets/cununie/cununie-4-small.jpg";
import cununie4large from "@/assets/cununie/cununie-4-large.jpg";
import eveniment1small from "@/assets/evenimente/eveniment-1-small.jpg";
import eveniment1large from "@/assets/evenimente/eveniment-1-large.jpg";
import eveniment2small from "@/assets/evenimente/eveniment-2-small.jpg";
import eveniment2large from "@/assets/evenimente/eveniment-2-large.jpg";
import eveniment3small from "@/assets/evenimente/eveniment-3-small.jpg";
import eveniment3large from "@/assets/evenimente/eveniment-3-large.jpg";
import eveniment4small from "@/assets/evenimente/eveniment-4-small.jpg";
import eveniment4large from "@/assets/evenimente/eveniment-4-large.jpg";
import eveniment5small from "@/assets/evenimente/eveniment-5-small.jpg";
import eveniment5large from "@/assets/evenimente/eveniment-5-large.jpg";
import nunta6small from "@/assets/nunta/nunta-6-small.jpg";
import nunta6large from "@/assets/nunta/nunta-6-large.jpg";
import nunta7small from "@/assets/nunta/nunta-7-small.jpg";
import nunta7large from "@/assets/nunta/nunta-7-large.jpg";
import nunta8small from "@/assets/nunta/nunta-8-small.jpg";
import nunta8large from "@/assets/nunta/nunta-8-large.jpg";
import nunta9small from "@/assets/nunta/nunta-9-small.jpg";
import nunta9large from "@/assets/nunta/nunta-9-large.jpg";
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
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion";
import { EASE, MaskReveal } from "@/components/motion-kit";
import { orderedCategories, type GalleryPhoto } from "@/lib/site-data";

// Înlocuiți src și highRes cu fotografiile studioului; proporțiile păstrează stabilă compoziția.
export const photos: GalleryPhoto[] = [
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
    src: nunta6small,
    highRes: nunta6large,
    aspectRatio: 1.5,
    category: "Nunți",
    title: "Detalii pentru ziua cea mare",
  },
  {
    src: nunta7small,
    highRes: nunta7large,
    aspectRatio: 1.5,
    category: "Nunți",
    title: "Verighete",
  },
  {
    src: nunta8small,
    highRes: nunta8large,
    aspectRatio: 1.5,
    category: "Nunți",
    title: "26 Septembrie",
  },
  {
    src: nunta9small,
    highRes: nunta9large,
    aspectRatio: 1.5,
    category: "Nunți",
    title: "Mireasa pe scări",
  },
  {
    src: cununie1small,
    highRes: cununie1large,
    aspectRatio: 0.67,
    category: "Cununie civilă",
    title: "Culorile cununiei",
  },
  {
    src: cununie2small,
    highRes: cununie2large,
    aspectRatio: 1.5,
    category: "Cununie civilă",
    title: "Cu martorii alături",
  },
  {
    src: cununie3small,
    highRes: cununie3large,
    aspectRatio: 0.67,
    category: "Cununie civilă",
    title: "Sărutul de după «da»",
  },
  {
    src: cununie4small,
    highRes: cununie4large,
    aspectRatio: 0.67,
    category: "Cununie civilă",
    title: "Semnătura",
  },
  {
    src: cununie5small,
    highRes: cununie5large,
    aspectRatio: 0.67,
    category: "Cununie civilă",
    title: "Capul pe umăr",
  },
  {
    src: cununie6small,
    highRes: cununie6large,
    aspectRatio: 0.67,
    category: "Cununie civilă",
    title: "Semnătura miresei",
  },
  {
    src: cununie7small,
    highRes: cununie7large,
    aspectRatio: 0.67,
    category: "Cununie civilă",
    title: "Sărut la semnătură",
  },
  {
    src: cununie8small,
    highRes: cununie8large,
    aspectRatio: 0.67,
    category: "Cununie civilă",
    title: "Îmbrățișare în parc",
  },
  {
    src: cununie9small,
    highRes: cununie9large,
    aspectRatio: 1.5,
    category: "Cununie civilă",
    title: "Pe banca din parc",
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
    src: eveniment1small,
    highRes: eveniment1large,
    aspectRatio: 0.67,
    category: "Evenimente",
    title: "Mireasa, în lumina serii",
  },
  {
    src: eveniment2small,
    highRes: eveniment2large,
    aspectRatio: 1.5,
    category: "Evenimente",
    title: "Privire peste umăr",
  },
  {
    src: eveniment3small,
    highRes: eveniment3large,
    aspectRatio: 0.67,
    category: "Evenimente",
    title: "Frunte lângă frunte",
  },
  {
    src: eveniment4small,
    highRes: eveniment4large,
    aspectRatio: 0.67,
    category: "Evenimente",
    title: "Printre brazi",
  },
  {
    src: eveniment5small,
    highRes: eveniment5large,
    aspectRatio: 0.67,
    category: "Evenimente",
    title: "Pe treptele salonului",
  },
];
type Photo = GalleryPhoto;
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
function FilmFrame({
  photo,
  number,
  onOpen,
}: {
  photo: Photo;
  number: number;
  onOpen: (photo: Photo, button: HTMLButtonElement) => void;
}) {
  return (
    <motion.figure
      className="film-frame"
      style={{ width: `calc(min(52vh, 440px) * ${photo.aspectRatio})` }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="film-photo">
        <Button
          variant="photo"
          className="photo-button"
          data-cursor="Vezi"
          aria-label={`Deschide fotografia: ${photo.title}`}
          onClick={(event) => onOpen(photo, event.currentTarget)}
        >
          <SafeImage src={photo.src} alt={`${photo.title} — ${photo.category}`} />
        </Button>
      </div>
      <figcaption className="film-caption">
        <span className="film-number">{String(number).padStart(2, "0")}</span>
        <span className="film-title">{photo.title}</span>
        <span className="film-category">{photo.category}</span>
      </figcaption>
    </motion.figure>
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
      transition={{ duration: 0.5, ease: EASE }}
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
          transition={{ duration: 0.65, ease: EASE }}
          onClick={(event) => event.stopPropagation()}
        >
          <SafeImage src={selected.src} alt={selected.title} eager />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: sharp ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
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
export function PortfolioGallery({ items = photos }: { items?: GalleryPhoto[] }) {
  const enhanced = useEnhancedMotion();
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const source = useRef<HTMLButtonElement | null>(null);
  const [category, setCategory] = useState("Toate");
  const [selected, setSelected] = useState<Photo | null>(null);
  const [distance, setDistance] = useState(0);
  const categories = ["Toate", ...orderedCategories(items)];
  const active = categories.includes(category) ? category : "Toate";
  const list = active === "Toate" ? items : items.filter((photo) => photo.category === active);
  useLayoutEffect(() => {
    const el = strip.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [list.length, active, enhanced]);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const { scrollXProgress } = useScroll({ container: viewport });
  const progress = enhanced ? scrollYProgress : scrollXProgress;
  const pinned = enhanced && distance > 0;
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
      <section id="portofoliu" className="section-inner">
        <div className="portfolio-top">
          <div>
            <p className="section-kicker">Povești în imagini</p>
            <h2 className="section-title">
              <MaskReveal as="div">
                Portofoliu<span className="text-primary">.</span>
              </MaskReveal>
            </h2>
            <p className="portfolio-description">Clipe care trec. Emoții care rămân.</p>
          </div>
          <div className="filters" role="group" aria-label="Categorii de fotografii">
            {categories.map((item) => (
              <Button
                key={item}
                variant="nav"
                data-active={active === item}
                aria-pressed={active === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div
          ref={track}
          className={`film-track ${pinned ? "film-pinned" : "film-native"}`}
          style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
        >
          <div className="film-sticky">
            <div
              ref={viewport}
              className="film-viewport"
              tabIndex={pinned ? undefined : 0}
              role="region"
              aria-label="Bandă de fotografii"
            >
              <motion.div
                key={active}
                ref={strip}
                className="film-strip"
                style={pinned ? { x } : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {list.map((photo, index) => (
                  <FilmFrame key={photo.src} photo={photo} number={index + 1} onOpen={open} />
                ))}
              </motion.div>
            </div>
            <div className="film-progress" aria-hidden="true">
              <motion.div className="film-progress-bar" style={{ scaleX: progress }} />
            </div>
            <div className="gallery-end">
              {String(list.length).padStart(2, "0")} povești. Nenumărate emoții.
            </div>
          </div>
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
