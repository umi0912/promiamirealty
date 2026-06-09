import Link from "next/link";
import { AGENT } from "@/lib/data";
import MortgageCalculator from "@/components/MortgageCalculator";

export default function Buyers() {
  const steps = [
    ["Get clear on budget", "Estimate payments and get pre-approved so you shop with confidence."],
    ["Tour with intent", "See the right homes, not every home — filtered to what fits."],
    ["Make a strong offer", "Price it right and structure terms that win without overpaying."],
    ["Close with support", "Inspections, financing, and paperwork — handled and explained."],
  ];
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>For buyers</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 16px", lineHeight: 1.05, maxWidth: 720 }}>Buy smart in a fast Miami market.</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted)", maxWidth: 600 }}>From first showing to closing day — clear numbers, honest advice, and a plan that fits your budget and timeline.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 48 }}>
        {steps.map(([t, d], i) => (
          <div key={i} style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
            <div style={{ fontSize: 13, color: "var(--coral)", fontWeight: 500, marginBottom: 10 }}>Step {i + 1}</div>
            <div style={{ fontSize: 17, fontFamily: "Fraunces, serif", fontWeight: 500, marginBottom: 8 }}>{t}</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontSize: "clamp(26px,3.5vw,34px)", marginBottom: 8 }}>Estimate your monthly payment</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 0, marginBottom: 24, maxWidth: 520 }}>Try any price to see how down payment, rate, and term change the monthly number.</p>
        <MortgageCalculator price={650000} />
      </div>

      <div style={{ marginTop: 32, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 15, color: "var(--muted)" }}>Buying as an investment instead? See cap rates, cash flow, and income properties.</div>
        <a href="/investors" style={{ color: "var(--coral)", fontSize: 14, fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>For investors →</a>
      </div>


      <div style={{ background: "var(--surface)", borderRadius: 20, padding: "40px 32px", marginTop: 64, textAlign: "center", border: "1px solid var(--line)" }}>
        <h2 style={{ fontSize: "clamp(24px,3vw,32px)", margin: "0 0 12px" }}>Ready to start your search?</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, margin: "0 0 24px" }}>Book a no-pressure consultation with {AGENT.name}.</p>
        <a href={AGENT.calendly} style={{ background: "var(--coral)", color: "#fff", padding: "14px 30px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Book a consultation</a>
      </div>
    </div>
  );
}
