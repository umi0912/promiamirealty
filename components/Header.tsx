"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AGENT } from "@/lib/data";

const nav = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/buyers", label: "Buyers" },
  { href: "/sellers", label: "Sellers" },
  { href: "/investors", label: "Investors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "all .3s",
      background: scrolled ? "rgba(20,16,12,.92)" : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", color: "var(--text)" }}>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>PRO MIAMI</span>
          <span style={{ fontFamily: "Outfit", fontSize: 11, letterSpacing: "0.3em", display: "block", color: "var(--coral)", marginTop: -4 }}>REALTY</span>
        </Link>
        <nav className="desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {nav.map(n => (
            <Link key={n.href} href={n.href} style={{ color: "var(--text)", textDecoration: "none", fontSize: 14, opacity: 0.85 }}>{n.label}</Link>
          ))}
          <a href={`tel:${AGENT.phoneRaw}`} style={{ color: "var(--bg)", background: "var(--coral)", padding: "9px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{AGENT.phone}</a>
        </nav>
        <button className="mobile-toggle" aria-label="Menu" onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", color: "var(--text)", fontSize: 24, cursor: "pointer" }}>{open ? "✕" : "☰"}</button>
      </div>
      {open && (
        <div className="mobile-menu" style={{ background: "rgba(20,16,12,.98)", borderTop: "1px solid var(--line)", padding: "16px 24px" }}>
          {nav.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ display: "block", color: "var(--text)", textDecoration: "none", fontSize: 16, padding: "12px 0" }}>{n.label}</Link>
          ))}
          <a href={`tel:${AGENT.phoneRaw}`} style={{ display: "block", color: "var(--coral)", fontSize: 16, padding: "12px 0", textDecoration: "none" }}>{AGENT.phone}</a>
        </div>
      )}
      <style>{`
        @media (max-width: 860px){ .desktop-nav{ display:none !important; } .mobile-toggle{ display:block !important; } }
      `}</style>
    </header>
  );
}
