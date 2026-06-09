"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AGENT } from "@/lib/data";
import { useLang, DictKey } from "@/lib/i18n";

const nav: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/search", key: "nav.search" },
  { href: "/city", key: "nav.cities" },
  { href: "/buyers", key: "nav.buyers" },
  { href: "/sellers", key: "nav.sellers" },
  { href: "/investors", key: "nav.investors" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  const LangToggle = () => (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden" }}>
      {(["en", "ru"] as const).map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          background: lang === l ? "var(--coral)" : "transparent",
          color: lang === l ? "#fff" : "var(--muted)",
          border: "none", padding: "6px 12px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit", textTransform: "uppercase",
        }}>{l}</button>
      ))}
    </div>
  );

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all .3s",
      background: scrolled ? "rgba(22,18,28,.92)" : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", color: "var(--text)" }}>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>PRO MIAMI</span>
          <span style={{ fontFamily: "Outfit", fontSize: 11, letterSpacing: "0.3em", display: "block", color: "var(--coral)", marginTop: -4 }}>REALTY</span>
        </Link>
        <nav className="desktop-nav" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {nav.map(n => (
            <Link key={n.href} href={n.href} style={{ color: "var(--text)", textDecoration: "none", fontSize: 14, opacity: 0.85 }}>{t(n.key)}</Link>
          ))}
          <LangToggle />
          <a href={`tel:${AGENT.phoneRaw}`} style={{ color: "#fff", background: "var(--coral)", padding: "9px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{AGENT.phone}</a>
        </nav>
        <button className="mobile-toggle" aria-label="Menu" onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", color: "var(--text)", fontSize: 24, cursor: "pointer" }}>{open ? "✕" : "☰"}</button>
      </div>
      {open && (
        <div className="mobile-menu" style={{ background: "rgba(22,18,28,.98)", borderTop: "1px solid var(--line)", padding: "16px 24px" }}>
          {nav.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ display: "block", color: "var(--text)", textDecoration: "none", fontSize: 16, padding: "12px 0" }}>{t(n.key)}</Link>
          ))}
          <div style={{ padding: "12px 0" }}><LangToggle /></div>
          <a href={`tel:${AGENT.phoneRaw}`} style={{ display: "block", color: "var(--coral)", fontSize: 16, padding: "12px 0", textDecoration: "none" }}>{AGENT.phone}</a>
        </div>
      )}
      <style>{`
        @media (max-width: 1100px){ .desktop-nav{ display:none !important; } .mobile-toggle{ display:block !important; } }
      `}</style>
    </header>
  );
}
