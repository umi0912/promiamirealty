import { AGENT } from "@/lib/data";

export default function Sellers() {
  const steps = [
    ["Price with data", "A pricing strategy built on real comps and current demand — not guesswork."],
    ["Prep & present", "Staging guidance and professional photos that make listings stand out."],
    ["Market widely", "MLS, syndication, and targeted reach to the right buyers."],
    ["Negotiate & close", "Strong negotiation and a smooth path through to the closing table."],
  ];
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>For sellers</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 16px", lineHeight: 1.05, maxWidth: 720 }}>Sell for more, with less stress.</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted)", maxWidth: 600 }}>The right price, sharp presentation, and wide exposure — so your home sells on the best terms and timeline for you.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 48 }}>
        {steps.map(([t, d], i) => (
          <div key={i} style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
            <div style={{ fontSize: 13, color: "var(--coral)", fontWeight: 500, marginBottom: 10 }}>Step {i + 1}</div>
            <div style={{ fontSize: 17, fontFamily: "Fraunces, serif", fontWeight: 500, marginBottom: 8 }}>{t}</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--surface)", borderRadius: 20, padding: "40px 32px", marginTop: 64, textAlign: "center", border: "1px solid var(--line)" }}>
        <h2 style={{ fontSize: "clamp(24px,3vw,32px)", margin: "0 0 12px" }}>What's your home worth?</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>Get a free, no-obligation market valuation based on current Miami comps.</p>
        <a href={AGENT.calendly} style={{ background: "var(--coral)", color: "#fff", padding: "14px 30px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Request a valuation</a>
      </div>
    </div>
  );
}
