"use client";
import { useState } from "react";
import CalcContactCTA from "@/components/CalcContactCTA";

export default function MortgageCalculator({
  price,
  editablePrice = false,
}: {
  price: number;
  editablePrice?: boolean;
}) {
  const [purchase, setPurchase] = useState(price);
  const [dp, setDp] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [taxYr, setTaxYr] = useState(Math.round((price * 0.011) / 100) * 100); // ~1.1%/yr default
  const [insYr, setInsYr] = useState(2400);
  const [hoaMo, setHoaMo] = useState(0);

  const loan = purchase * (1 - dp / 100);
  const mr = rate / 100 / 12;
  const n = term * 12;
  const pi = mr === 0 ? loan / n : (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  const taxMo = taxYr / 12;
  const insMo = insYr / 12;
  const total = pi + taxMo + insMo + hoaMo;
  const usd = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg)",
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "10px 12px",
    color: "var(--text)",
    fontSize: 15,
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 6,
    display: "block",
  };

  const field = (label: string, node: React.ReactNode, hint?: string) => (
    <div style={{ flex: "1 1 140px", minWidth: 130 }}>
      <label style={labelStyle}>{label}</label>
      {node}
      {hint && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5, lineHeight: 1.4 }}>{hint}</div>}
    </div>
  );

  const numInput = (val: number, set: (n: number) => void, prefix?: string, suffix?: string) => (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {prefix && (
        <span style={{ position: "absolute", left: 12, color: "var(--muted)", fontSize: 15, pointerEvents: "none" }}>{prefix}</span>
      )}
      <input
        type="number"
        value={val}
        onChange={(e) => set(e.target.value === "" ? 0 : +e.target.value)}
        style={{ ...inputStyle, paddingLeft: prefix ? 26 : 12, paddingRight: suffix ? 34 : 12 }}
      />
      {suffix && (
        <span style={{ position: "absolute", right: 12, color: "var(--muted)", fontSize: 14, pointerEvents: "none" }}>{suffix}</span>
      )}
    </div>
  );

  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
      <h3 style={{ fontSize: 18, margin: "0 0 18px" }}>Mortgage estimate</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        {field("Purchase price", editablePrice
          ? numInput(purchase, setPurchase, "$")
          : <div style={{ ...inputStyle, opacity: 0.85 }}>{usd(purchase)}</div>)}
        {field("Down payment", numInput(dp, (v) => setDp(Math.min(100, Math.max(0, v))), undefined, "%"))}
        {field("Interest rate", numInput(rate, setRate, undefined, "%"))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Loan term</label>
        <div style={{ display: "flex", gap: 8 }}>
          {[15, 30].map((y) => (
            <button
              key={y}
              onClick={() => setTerm(y)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 10,
                border: "1px solid var(--line)",
                background: term === y ? "var(--coral)" : "var(--bg)",
                color: term === y ? "#fff" : "var(--text)",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {y} years
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        {field("Taxes (yearly)", numInput(taxYr, setTaxYr, "$"), "Usually ~1.5–2% of price/yr")}
        {field("Insurance (yearly)", numInput(insYr, setInsYr, "$"), "South FL ~$2.5–5k/yr")}
        {field("HOA (monthly)", numInput(hoaMo, setHoaMo, "$"), "From the listing; 0 if none")}
      </div>

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>Est. monthly payment</span>
          <span style={{ fontSize: 30, fontWeight: 500, color: "var(--coral)", fontFamily: "Fraunces, serif" }}>{usd(total)}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
          <span>Principal &amp; interest: {usd(pi)}</span>
          <span>Taxes: {usd(taxMo)}</span>
          <span>Insurance: {usd(insMo)}</span>
          <span>HOA: {usd(hoaMo)}</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, marginBottom: 0 }}>For illustration only. Confirm exact figures with your lender.</p>
      </div>

      <CalcContactCTA />
    </div>
  );
}
