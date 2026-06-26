"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AGENT } from "@/lib/data";
import { useLang, DictKey } from "@/lib/i18n";

const nav: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/search", key: "nav.search" },
  { href: "/buyers", key: "nav.buyers" },
  { href: "/sellers", key: "nav.sellers" },
  { href: "/investors", key: "nav.investors" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  const LangToggle = () => (
    <div style={{ display: "inline-flex", border: "1px solid rgba(255,255,255,.28)", borderRadius: 999, overflow: "hidden" }}>
      {(["en", "ru"] as const).map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          background: lang === l ? "#fff" : "transparent",
          color: lang === l ? "var(--indigo)" : "rgba(255,255,255,.7)",
          border: "none", padding: "6px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Manrope, sans-serif", textTransform: "uppercase",
        }}>{l}</button>
      ))}
    </div>
  );

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "18px 24px" }}>
      <div style={{
        maxWidth: 1340, margin: "0 auto", background: "var(--indigo)", borderRadius: 18,
        boxShadow: "0 10px 40px rgba(44,90,80,.28)", padding: "0 14px 0 28px",
        height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18,
      }}>
        {/* logo */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <Image src="/logo.png" alt="PRO MIAMI REALTY" width={140} height={48} priority style={{ height: "auto" }} />
        </Link>

        {/* desktop nav — visible links, SERHANT-style dark pill */}
        <nav className="desktop-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {nav.map(n => (
            <Link key={n.href} href={n.href} className="navlink" style={{ color: "rgba(255,255,255,.85)", textDecoration: "none", fontSize: 14.5, fontWeight: 500 }}>{t(n.key)}</Link>
          ))}
          <LangToggle />
          <a href={`tel:${AGENT.phoneRaw}`} className="btn" style={{ color: "var(--indigo)", background: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 14.5, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>{AGENT.phone}</a>
        </nav>

        {/* mobile toggle */}
        <button className="mobile-toggle" aria-label="Menu" onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>{open ? "✕" : "☰"}</button>
      </div>

      {open && (
        <div className="mobile-menu" style={{ maxWidth: 1340, margin: "10px auto 0", background: "var(--indigo)", borderRadius: 18, padding: "12px 24px 20px", boxShadow: "0 10px 40px rgba(44,90,80,.28)" }}>
          {nav.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ display: "block", color: "rgba(255,255,255,.9)", textDecoration: "none", fontSize: 16, padding: "12px 0" }}>{t(n.key)}</Link>
          ))}
          <div style={{ padding: "12px 0" }}><LangToggle /></div>
          <a href={`tel:${AGENT.phoneRaw}`} style={{ display: "inline-block", color: "var(--indigo)", background: "#fff", fontSize: 16, fontWeight: 700, padding: "12px 22px", borderRadius: 10, textDecoration: "none", marginTop: 6 }}>{AGENT.phone}</a>
        </div>
      )}

      <style>{`
        .navlink:hover{ opacity:1; color:#fff !important; }
        @media (max-width: 1040px){ .desktop-nav{ display:none !important; } .mobile-toggle{ display:block !important; } }
      `}</style>
    </header>
  );
}
