import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion";

/** Shared easing: fast start, long soft landing. Used by every reveal so the page feels like one system. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Thin gold line at the top of the page that fills as the visitor scrolls. */
export function ScrollProgress() {
  const enhanced = useEnhancedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  if (!enhanced) return null;
  return <motion.div aria-hidden className="scroll-progress" style={{ scaleX }} />;
}

/** Fade + rise on scroll. Opacity-only on mobile and with reduced motion. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & Omit<
  HTMLMotionProps<"div">,
  "children" | "className"
>) {
  const enhanced = useEnhancedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: enhanced ? y : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: enhanced ? 0.9 : 0.4, delay: enhanced ? delay : 0, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Text that slides up out of an invisible mask: the classic editorial heading reveal. */
export function MaskReveal({
  children,
  delay = 0,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "span" | "div";
}) {
  const enhanced = useEnhancedMotion();
  const MotionTag = motion[Tag];
  return (
    <Tag className={`mask-line ${className ?? ""}`}>
      <MotionTag
        className="mask-line-inner"
        initial={{ opacity: 0, y: enhanced ? "105%" : 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: enhanced ? 1.1 : 0.5, delay: enhanced ? delay : 0, ease: EASE }}
      >
        {children}
      </MotionTag>
    </Tag>
  );
}

/** Pulls its content a few pixels toward the cursor. Desktop-with-mouse only. */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const enhanced = useEnhancedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 18, mass: 0.4 });
  if (!enhanced) return <span className="magnetic">{children}</span>;
  return (
    <motion.span
      ref={ref}
      className="magnetic"
      style={{ x, y }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Counts from 0 to `to` the first time it scrolls into view. Shows the final number straight away without motion. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const enhanced = useEnhancedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(to);
  useEffect(() => {
    if (!enhanced) {
      setValue(to);
      return;
    }
    setValue(0);
  }, [enhanced, to]);
  useEffect(() => {
    if (!enhanced || !inView) return;
    const controls = animate(0, to, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [enhanced, inView, to]);
  return (
    <strong ref={ref}>
      {value}
      {suffix}
    </strong>
  );
}

/** Slow, endless keyword strip. Pure CSS transform animation; paused for reduced motion. */
export function Marquee({ items }: { items: string[] }) {
  const row = (
    <>
      {items.map((item) => (
        <span key={item} className="marquee-item">
          {item}
          <i aria-hidden />
        </span>
      ))}
    </>
  );
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        <div className="marquee-group">{row}</div>
        <div className="marquee-group">{row}</div>
      </div>
    </div>
  );
}

/**
 * A soft ring that trails the mouse and grows over links and photos.
 * Elements can opt in to a label with data-cursor="Vezi".
 */
export function CursorRing() {
  const enhanced = useEnhancedMotion();
  const x = useSpring(useMotionValue(-100), { stiffness: 380, damping: 32, mass: 0.35 });
  const y = useSpring(useMotionValue(-100), { stiffness: 380, damping: 32, mass: 0.35 });
  const [mode, setMode] = useState<"idle" | "link" | "label">("idle");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enhanced) return;
    document.documentElement.classList.add("has-ring");
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setMode("label");
        setLabel(labelled.getAttribute("data-cursor") ?? "");
      } else if (target?.closest("a, button, input, textarea, label")) {
        setMode("link");
      } else {
        setMode("idle");
      }
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-ring");
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enhanced, x, y]);
  if (!enhanced) return null;
  return (
    <motion.div aria-hidden className="cursor-ring-pos" style={{ x, y }}>
      <motion.div
        className="cursor-ring"
        data-mode={mode}
        animate={{
          opacity: visible ? 1 : 0,
          scale: mode === "label" ? 1 : mode === "link" ? 0.62 : 0.3,
        }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <span>{mode === "label" ? label : ""}</span>
      </motion.div>
    </motion.div>
  );
}
