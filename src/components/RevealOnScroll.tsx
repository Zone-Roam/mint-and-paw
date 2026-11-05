"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Fades `.rv` blocks in as they scroll into view; re-scans after each client-side navigation.
export default function RevealOnScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll(".rv:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
