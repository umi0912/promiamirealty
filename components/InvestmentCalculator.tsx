"use client";
import { useState } from "react";

export default function InvestmentCalculator() {
  const [price, setPrice] = useState(600000);
  const [dp, setDp] = useState(25);
  const [rate, setRate] = useState(6.5);
  const [rent, setRent] = useState(4200);
  const [expenses, setExpenses] = useState(900);

  const loan = price * (1 - dp / 100);
  const down = price * dp / 100;
  const mr = rate / 100 / 12;
  const n = 30 * 12;
  const mortgage = mr === 0 ? loan / n : (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  const monthlyCashFlow = rent - expenses - mortgage;
  const annualNOI = (rent - expenses) * 12;
  const capRate = (annualNOI / price) * 100;
  const cashOnCash = ((monthlyCashFlow * 12) / down) * 100;

  const field = (label: string, val: number, set: (n: number) => void, prefix = "$", step = 1000) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--line)", padding: "0 12px" }}>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>{prefix}</span>
        <input type="number" value={val} step={step} onChange={e=>set(+e.target.value||0)} style={{ background: "none", border: "none", color: "var(--text)", fontSize: 15, padding: "10px 8px", width: "100%", outline: "none" }} />
      </div>
    </div>
  );
  const metric = (label: string, val: string, accent = false) => (
    <div style={{ background: "var(--bg)", borderRadius: 12, padding: 16, textAlign: "center" }}>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 500, fontFamily: "Fraunces, serif", color: accent ? (monthlyCashFlow >= 0 ? "var(--amber)" : "#E24B4A") : "var(--text)" }}>{val}</div>
    </div>
  );
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
      <h3 style={{ fontSize: 18, margin: "0 0 18px" }}>Investment analysis</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        {field("Purchase price", price, setPrice)}
        {field("Down payment %", dp, setDp, "", 5)}
        {field("Interest rate %", rate, setRate, "", 0.25)}
        {field("Monthly rent", rent, setRent, "$", 100)}
        {field("Monthly expenses", expenses, setExpenses, "$", 100)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginTop: 18 }}>
        {metric("Cap rate", capRate.toFixed(2) + "%")}
        {metric("Cash-on-cash", cashOnCash.toFixed(2) + "%")}
        {metric("Monthly cash flow", "$" + Math.round(monthlyCashFlow).toLocaleString("en-US"), true)}
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14, marginBottom: 0 }}>Estimates for illustration only. 30-year term assumed. Excludes taxes, insurance, vacancy.</p>
    </div>
  );
}
