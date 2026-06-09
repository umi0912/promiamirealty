"use client";
import Link from "next/link";
import { AGENT } from "@/lib/data";
import { useLang, DictKey } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  const links: [string, DictKey][] = [["/search","nav.search"],["/city","nav.cities"],["/buyers","nav.buyers"],["/sellers","nav.sellers"],["/investors","nav.investors"],["/services","nav.services"],["/about","nav.about"],["/contact","nav.contact"]];
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 40 }}>
        <div>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600 }}>PRO MIAMI</span>
          <span style={{ fontFamily: "Outfit", fontSize: 11, letterSpacing: "0.3em", display: "block", color: "var(--coral)", marginTop: -2 }}>REALTY</span>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 16, maxWidth: 260 }}>{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontFamily: "Outfit", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{t("footer.explore")}</h4>
          {links.map(([h, k]) => (
            <Link key={h} href={h} style={{ display: "block", color: "var(--text)", textDecoration: "none", fontSize: 14, padding: "6px 0", opacity: 0.85 }}>{t(k)}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontFamily: "Outfit", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{t("footer.contact")}</h4>
          <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.9, margin: 0 }}>
            {AGENT.name}<br />
            <span style={{ color: "var(--muted)" }}>{AGENT.brokerage} · {AGENT.license}</span><br />
            <a href={`tel:${AGENT.phoneRaw}`} style={{ color: "var(--text)", textDecoration: "none" }}>{AGENT.phone}</a><br />
            <a href={`mailto:${AGENT.email}`} style={{ color: "var(--text)", textDecoration: "none" }}>{AGENT.email}</a><br />
            <span style={{ color: "var(--muted)" }}>{AGENT.address}</span>
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontFamily: "Outfit", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{t("footer.connect")}</h4>
          <a href={AGENT.calendly} style={{ display: "inline-block", color: "#fff", background: "var(--coral)", padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 16 }}>{t("common.bookConsult")}</a>
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <a href="#" aria-label="Instagram" style={{ color: "var(--muted)", fontSize: 20 }}>◐</a>
            <a href="#" aria-label="Facebook" style={{ color: "var(--muted)", fontSize: 20 }}>◑</a>
            <a href={AGENT.google} aria-label="Google" style={{ color: "var(--muted)", fontSize: 20 }}>◓</a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--line)", padding: "20px 24px", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>© {new Date().getFullYear()} {AGENT.brokerage}. {t("footer.rights")}</span>
        <span style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/privacy" style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>{t("footer.privacy")}</Link>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>{t("footer.equal")}</span>
        </span>
      </div>
    </footer>
  );
}
