"use client";
import { useEffect, useRef, ReactNode } from "react";

// Появление контента при скролле: добавляет класс `in` один раз, когда блок входит в viewport.
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  style,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section";
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}>
      {children}
    </Tag>
  );
}
