import Link from "next/link";
import { AGENT } from "@/lib/data";

export default function About() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="agrid">
        <div>
          <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>About</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 20px", lineHeight: 1.05 }}>{AGENT.name}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted)" }}>
            A Miami-based real estate professional with {AGENT.brokerage}, helping buyers, sellers, and investors move with confidence across Miami-Dade and Broward.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--muted)" }}>
            From first-time buyers to seasoned investors, the approach is the same: clear guidance, honest numbers, and steady support from first showing to closing day.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
            <a href={AGENT.calendly} style={{ background: "var(--coral)", color: "#fff", padding: "13px 26px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Book a consultation</a>
            <Link href="/contact" style={{ background: "rgba(246,241,236,.08)", color: "var(--text)", padding: "13px 26px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none", border: "1px solid var(--line)" }}>Get in touch</Link>
          </div>
        </div>
        <div style={{ aspectRatio: "4/5", borderRadius: 20, background: "var(--surface-2)", backgroundImage: "url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginTop: 72 }}>
        {[["Local", "Miami-Dade & Broward focus"], ["Honest", "Clear numbers, no pressure"], ["Full-service", "Buy, sell & invest"], ["Responsive", "A calm hand, start to close"]].map(([t, d], i) => (
          <div key={i} style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
            <div style={{ fontSize: 18, fontFamily: "Fraunces, serif", fontWeight: 500, marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{d}</div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:820px){ .agrid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}
