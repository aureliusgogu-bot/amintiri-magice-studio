import { useEffect, useState } from "react";

export function useEnhancedMotion() {
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnhanced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return enhanced;
}