"use client";
import { useState } from "react";

// Предварительная оценка: площадь × ориентир цены за sqft по типу/локации.
// Это НЕ официальная оценка — точную даёт агент по MLS-компам (подключится через IDX).
// Грубые ориентиры $/sqft по рынку Майами (демо; заменить на данные по компам).
const PPSF: Record<string, number> = { condo: 620, house: 410, townhouse: 470 };

export default function HomeValuation() {
  const [step, setStep] = useState<"calc" | "lead" | "done">("calc");
  const [type, setType] = useState("house");
  const [sqft, setSqft] = useState(1800);
  const [beds, setBeds] = useState(3);
  const [zip, setZip] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "", address: "" });
  const [busy, setBusy] = useState(false);

  const base = sqft * (PPSF[type] || 450);
  const low = Math.round((base * 0.92) / 1000) * 1000;
  const high = Math.round((base * 1.08) / 1000) * 1000;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US");

  const submitLead = async () => {
    if (!contact.name || !contact.email) return;
    setBusy(true);
    try {
      await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, message: `Home valuation request — type:${type}, ~${sqft}sqft, ${beds}bd, zip:${zip}. Est. range ${fmt(low)}–${fmt(high)}.` }),
      });
    } catch {}
    setBusy(false);
    setStep("done");
  };

  const inp: React.CSSProperties = { width: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "12px 14px", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Outfit" };
  const sel: React.CSSProperties = { ...inp, appearance: "auto" as const };
  const lab: React.CSSProperties = { fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };

  if (step === "done") return (
    <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 22, fontFamily: "Fraunces, serif", marginBottom: 8 }}>Request received</div>
      <p style={{ color: "var(--muted)", fontSize: 15, margin: 0, lineHeight: 1.7 }}>You'll get a detailed, comp-based valuation shortly — based on real recent sales in your area, not just an estimate.</p>
    </div>
  );

  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 24 }}>
      {step === "calc" && (
        <>
          <h3 style={{ fontSize: 18, margin: "0 0 18px" }}>Estimate your home's value</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
            <div><label style={lab}>Property type</label><select style={sel} value={type} onChange={e => setType(e.target.value)}><option value="house">Single family</option><option value="condo">Condo</option><option value="townhouse">Townhouse</option></select></div>
            <div><label style={lab}>Living area (sqft)</label><input style={inp} type="number" value={sqft} step={50} onChange={e => setSqft(+e.target.value || 0)} /></div>
            <div><label style={lab}>Bedrooms</label><select style={sel} value={beds} onChange={e => setBeds(+e.target.value)}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
            <div><label style={lab}>ZIP code</label><input style={inp} value={zip} placeholder="33027" onChange={e => setZip(e.target.value)} /></div>
          </div>
          <div style={{ background: "var(--bg)", borderRadius: 12, padding: 20, marginTop: 18, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Estimated value range</div>
            <div style={{ fontSize: 28, fontWeight: 500, fontFamily: "Fraunces, serif", color: "var(--amber)" }}>{fmt(low)} – {fmt(high)}</div>
          </div>
          <button onClick={() => setStep("lead")} style={{ width: "100%", marginTop: 16, background: "var(--coral)", color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit" }}>Get an accurate valuation →</button>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, marginBottom: 0 }}>Rough estimate based on area price per square foot. A precise valuation uses recent comparable sales — request one above.</p>
        </>
      )}
      {step === "lead" && (
        <>
          <h3 style={{ fontSize: 18, margin: "0 0 6px" }}>Get your detailed valuation</h3>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 18px" }}>Based on real recent sales near you. No obligation.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input style={inp} placeholder="Your name" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />
            <input style={inp} placeholder="Email" type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
            <input style={inp} placeholder="Phone (optional)" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} />
            <input style={inp} placeholder="Property address" value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} />
          </div>
          <button onClick={submitLead} disabled={busy} style={{ width: "100%", marginTop: 16, background: "var(--coral)", color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", opacity: busy ? 0.6 : 1, fontFamily: "Outfit" }}>{busy ? "Sending…" : "Request valuation"}</button>
          <button onClick={() => setStep("calc")} style={{ width: "100%", marginTop: 10, background: "none", color: "var(--muted)", border: "none", fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>← Back to estimate</button>
        </>
      )}
    </div>
  );
}
