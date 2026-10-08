import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion";

export function ParallaxPhoto({
  src,
  alt,
  className,
  distance = 55,
  eager = false,
}: {
  src: string;
  alt: string;
  className: string;
  distance?: number;
  eager?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const enhanced = useEnhancedMotion();
  const [failed, setFailed] = useState(false);
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
  return (
    <div ref={frame} className={`parallax-photo ${className}`}>
      <motion.div className="parallax-photo-layer" style={enhanced ? { y, x } : {}}>
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
    </div>
  );
}