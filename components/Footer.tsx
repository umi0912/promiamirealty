"use client";
import Link from "next/link";
import { AGENT } from "@/lib/data";
import { useLang, DictKey } from "@/lib/i18n";

const socialIcon: React.CSSProperties = {
  width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--line)",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  color: "var(--indigo)", background: "#fff", transition: "all .2s",
};

export default function Footer() {
  const { t } = useLang();
  const links: [string, DictKey][] = [["/search","nav.search"],["/city","nav.cities"],["/buyers","nav.buyers"],["/sellers","nav.sellers"],["/investors","nav.investors"],["/services","nav.services"],["/about","nav.about"],["/contact","nav.contact"]];
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 40 }}>
        <div>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, fontWeight: 600 }}>PRO MIAMI</span>
          <span style={{ fontFamily: "Inter", fontSize: 11, letterSpacing: "0.3em", display: "block", color: "var(--coral)", marginTop: -2 }}>REALTY</span>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 16, maxWidth: 260 }}>{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontFamily: "Inter", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{t("footer.explore")}</h4>
          {links.map(([h, k]) => (
            <Link key={h} href={h} style={{ display: "block", color: "var(--text)", textDecoration: "none", fontSize: 14, padding: "6px 0", opacity: 0.85 }}>{t(k)}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontFamily: "Inter", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{t("footer.contact")}</h4>
          <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.9, margin: 0 }}>
            {AGENT.name}<br />
            <span style={{ color: "var(--muted)" }}>{AGENT.brokerage} · {AGENT.license}</span><br />
            <a href={`tel:${AGENT.phoneRaw}`} style={{ color: "var(--text)", textDecoration: "none" }}>{AGENT.phone}</a><br />
            <a href={`mailto:${AGENT.email}`} style={{ color: "var(--text)", textDecoration: "none" }}>{AGENT.email}</a><br />
            <span style={{ color: "var(--muted)" }}>{AGENT.address}</span>
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontFamily: "Inter", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{t("footer.connect")}</h4>
          <a href={AGENT.calendly} style={{ display: "inline-block", color: "#fff", background: "var(--coral)", padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 16 }}>{t("common.bookConsult")}</a>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <a href={AGENT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.12 1.38C1.36 2.67.95 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.8.72 1.47 1.38 2.13.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.8-.31 1.47-.72 2.13-1.38.66-.66 1.07-1.33 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.8-.72-1.47-1.38-2.13-.66-.66-1.33-1.07-2.13-1.38-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm7.85-10.41a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
            </a>
            <a href={AGENT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
            </a>
            <a href={AGENT.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.43 9.43 0 01-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.42 9.42 0 01-1.44-5.01c0-5.2 4.24-9.44 9.46-9.44 2.53 0 4.9.99 6.69 2.78a9.39 9.39 0 012.77 6.67c0 5.2-4.24 9.44-9.46 9.44zM20.52 3.5A11.78 11.78 0 0012.04 0C5.46 0 .1 5.35.1 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.93 11.93 0 005.73 1.46h.01c6.58 0 11.94-5.35 11.94-11.92 0-3.19-1.24-6.18-3.46-8.39z"/></svg>
            </a>
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
