import { AGENT } from "@/lib/data";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>Contact</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 16px", lineHeight: 1.05 }}>Let's talk.</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted)", maxWidth: 560 }}>Questions about a listing, the market, or where to start? Send a note or book a time directly.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 40 }} className="cgrid">
        <div>
          <ContactForm />
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <a href={`tel:${AGENT.phoneRaw}`} style={{ color: "var(--text)", textDecoration: "none", fontSize: 16 }}>📞 {AGENT.phone}</a>
            <a href={`mailto:${AGENT.email}`} style={{ color: "var(--text)", textDecoration: "none", fontSize: 16 }}>✉️ {AGENT.email}</a>
            <span style={{ color: "var(--muted)", fontSize: 15 }}>📍 {AGENT.address}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 12 }}>Or pick a time that works for you:</div>
          <iframe src={`${AGENT.calendly}?hide_gdpr_banner=1`} width="100%" height="600" frameBorder="0" title="Book" style={{ borderRadius: 16, border: "1px solid var(--line)", display: "block" }} />
        </div>
      </div>
      <style>{`@media(max-width:820px){ .cgrid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}
