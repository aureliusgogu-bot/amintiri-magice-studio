import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type SwapPhoto = { src: string; alt: string };

export function ParallaxPhoto({
  src,
  alt,
  className,
  distance = 55,
  eager = false,
  swap,
  swapEvery = 5000,
}: {
  src: string;
  alt: string;
  className: string;
  distance?: number;
  eager?: boolean;
  /** Extra photos that slowly take turns replacing the main one. */
  swap?: SwapPhoto[];
  /** How long each photo stays on screen, in milliseconds. */
  swapEvery?: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const enhanced = useEnhancedMotion();
  const [failed, setFailed] = useState(false);
  // -1 means the main photo is showing; 0..n means one of the swap photos.
  const [active, setActive] = useState(-1);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const pointer = useMotionValue(0);
  const x = useSpring(pointer, { stiffness: 65, damping: 30 });

  useEffect(() => {
    if (!enhanced) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.set((event.clientX / window.innerWidth - 0.5) * 14);
    };
    const reset = () => pointer.set(0);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [enhanced, pointer]);

  // The turn-taking only runs where full motion is allowed; on a phone or with
  // reduced motion the main photo simply stays.
  useEffect(() => {
    if (!enhanced || !swap || swap.length === 0) return;
    let step = -1;
    let interval = 0;
    const tick = () => {
      step = step >= swap.length - 1 ? -1 : step + 1;
      setActive(step);
    };
    const start = window.setTimeout(
      () => {
        tick();
        interval = window.setInterval(tick, swapEvery);
      },
      Math.round(swapEvery * 0.6),
    );
    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [enhanced, swap, swapEvery]);

  return (
    <div ref={frame} className={`parallax-photo ${className}`}>
      <motion.div className="parallax-photo-layer" style={enhanced ? { y, x } : {}}>
        <div className="parallax-photo-stack">
          <motion.div
            className="parallax-photo-frame"
            animate={{ opacity: active === -1 ? 1 : 0 }}
            transition={{ duration: 1.6, ease: EASE }}
          >
            {failed ? (
              <span className="photo-fallback" role="img" aria-label={alt} />
            ) : (
              <motion.img
                src={src}
                alt={alt}
                loading={eager ? "eager" : "lazy"}
                fetchPriority={eager ? "high" : "auto"}
                decoding="async"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                onError={() => setFailed(true)}
              />
            )}
          </motion.div>
          {enhanced &&
            swap?.map((photo, i) => (
              <motion.div
                key={photo.src}
                className="parallax-photo-frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1.045 : 1 }}
                transition={{
                  opacity: { duration: 1.6, ease: EASE },
                  scale: { duration: swapEvery / 1000 + 1.6, ease: "easeOut" },
                }}
              >
                <img src={photo.src} alt="" aria-hidden loading="lazy" decoding="async" />
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
