import Link from "next/link";
import { AGENT } from "@/lib/data";

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 40 }}>
        <div>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600 }}>PRO MIAMI</span>
          <span style={{ fontFamily: "Outfit", fontSize: 11, letterSpacing: "0.3em", display: "block", color: "var(--coral)", marginTop: -2 }}>REALTY</span>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 16, maxWidth: 260 }}>
            Buying, selling, and investing across Miami-Dade and Broward — guided by local expertise.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontFamily: "Outfit", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Explore</h4>
          {[["/search","Search listings"],["/buyers","For buyers"],["/sellers","For sellers"],["/about","About Ays"],["/contact","Contact"]].map(([h,l]) => (
            <Link key={h} href={h} style={{ display: "block", color: "var(--text)", textDecoration: "none", fontSize: 14, padding: "6px 0", opacity: 0.85 }}>{l}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontFamily: "Outfit", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Contact</h4>
          <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.9, margin: 0 }}>
            {AGENT.name}<br />
            <span style={{ color: "var(--muted)" }}>{AGENT.brokerage} · {AGENT.license}</span><br />
            <a href={`tel:${AGENT.phoneRaw}`} style={{ color: "var(--text)", textDecoration: "none" }}>{AGENT.phone}</a><br />
            <a href={`mailto:${AGENT.email}`} style={{ color: "var(--text)", textDecoration: "none" }}>{AGENT.email}</a><br />
            <span style={{ color: "var(--muted)" }}>{AGENT.address}</span>
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontFamily: "Outfit", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Connect</h4>
          <a href={AGENT.calendly} style={{ display: "inline-block", color: "var(--bg)", background: "var(--coral)", padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 16 }}>Book a consultation</a>
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <a href="#" aria-label="Instagram" style={{ color: "var(--muted)", fontSize: 20 }}>◐</a>
            <a href="#" aria-label="Facebook" style={{ color: "var(--muted)", fontSize: 20 }}>◑</a>
            <a href={AGENT.google} aria-label="Google" style={{ color: "var(--muted)", fontSize: 20 }}>◓</a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--line)", padding: "20px 24px", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>© {new Date().getFullYear()} {AGENT.brokerage}. All rights reserved.</span>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>Equal Housing Opportunity · Listings via BeachesMLS IDX</span>
      </div>
    </footer>
  );
}
