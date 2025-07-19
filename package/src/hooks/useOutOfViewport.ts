import { useState, useEffect, RefObject } from "react";

export function useOutOfViewport(ref: RefObject<HTMLElement | HTMLDivElement | null>) {
  const [isOutOfViewport, setIsOutOfViewport] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOutOfViewport(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% is visible
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isOutOfViewport;
}
