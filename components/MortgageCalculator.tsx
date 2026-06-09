"use client";
import { useState } from "react";

export default function MortgageCalculator({ price }: { price: number }) {
  const [dp, setDp] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const loan = price * (1 - dp / 100);
  const mr = rate / 100 / 12;
  const n = term * 12;
  const m = mr === 0 ? loan / n : (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  const row = (label: string, val: string, el: React.ReactNode) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
      <label style={{ fontSize: 13, color: "var(--muted)", minWidth: 110 }}>{label}</label>
      {el}
      <span style={{ fontSize: 13, fontWeight: 500, minWidth: 80, textAlign: "right" }}>{val}</span>
    </div>
  );
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
      <h3 style={{ fontSize: 18, margin: "0 0 18px" }}>Mortgage estimate</h3>
      {row("Down payment", `${dp}% · $${Math.round(price*dp/100/1000)}k`, <input type="range" min={5} max={50} step={1} value={dp} onChange={e=>setDp(+e.target.value)} style={{ flex: 1 }} />)}
      {row("Interest rate", `${rate.toFixed(1)}%`, <input type="range" min={3} max={9} step={0.1} value={rate} onChange={e=>setRate(+e.target.value)} style={{ flex: 1 }} />)}
      {row("Term", `${term} yrs`, <input type="range" min={10} max={30} step={5} value={term} onChange={e=>setTerm(+e.target.value)} style={{ flex: 1 }} />)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: 4 }}>
        <span style={{ fontSize: 14, color: "var(--muted)" }}>Est. monthly payment</span>
        <span style={{ fontSize: 28, fontWeight: 500, color: "var(--coral)", fontFamily: "Fraunces, serif" }}>${Math.round(m).toLocaleString("en-US")}</span>
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, marginBottom: 0 }}>Estimate excludes taxes, insurance, and HOA. For illustration only.</p>
    </div>
  );
}
