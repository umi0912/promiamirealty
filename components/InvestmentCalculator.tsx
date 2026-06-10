"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

export default function InvestmentCalculator() {
  const { lang } = useLang();
  const [price, setPrice] = useState(600000);
  const [dp, setDp] = useState(25);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [rent, setRent] = useState(4200);
  const [taxYr, setTaxYr] = useState(6600);
  const [insYr, setInsYr] = useState(2400);
  const [hoaMo, setHoaMo] = useState(0);

  const loan = price * (1 - dp / 100);
  const down = price * dp / 100;
  const mr = rate / 100 / 12;
  const n = term * 12;
  const mortgage = mr === 0 ? loan / n : (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);

  // Operating expenses (NOT including mortgage) — monthly
  const opMonthly = taxYr / 12 + insYr / 12 + hoaMo;
  // NOI (annual) = rental income - operating expenses, excludes financing
  const noiAnnual = (rent - opMonthly) * 12;
  // Cap rate = NOI / purchase price
  const capRate = price > 0 ? (noiAnnual / price) * 100 : 0;
  // Annual cash flow = income - operating expenses - mortgage, annualized
  const annualCashFlow = (rent - opMonthly - mortgage) * 12;

  const L = {
    title: { en: "What you'd earn", ru: "Сколько вы заработаете" },
    price: { en: "Purchase price", ru: "Цена покупки" },
    dp: { en: "Down payment %", ru: "Первый взнос %" },
    rate: { en: "Interest rate %", ru: "Ставка по ипотеке %" },
    term: { en: "Loan term", ru: "Срок кредита" },
    rent: { en: "Monthly rent income", ru: "Доход от аренды в месяц" },
    tax: { en: "Taxes (yearly)", ru: "Налоги (в год)" },
    ins: { en: "Insurance (yearly)", ru: "Страховка (в год)" },
    hoa: { en: "HOA (monthly)", ru: "Ассоциация (в месяц)" },
    cap: { en: "Cap rate", ru: "Cap rate (доходность)" },
    capSub: { en: "Net income vs. price — ignores financing", ru: "Чистый доход к цене — без учёта ипотеки" },
    cf: { en: "Annual cash flow", ru: "Денежный поток / год" },
    cfSub: { en: "After mortgage and operating costs", ru: "После ипотеки и расходов" },
    note: { en: "Simple estimate. Excludes vacancy, management, and one-time costs — ask for a full breakdown.", ru: "Упрощённая оценка. Без учёта простоя, управления и разовых затрат — полный расчёт по запросу." },
  };
  const tt = (o: { en: string; ru: string }) => o[lang];

  const field = (label: string, val: number, set: (n: number) => void, prefix = "$", step = 1000) => (
    <div>
      <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--line)", padding: "0 12px" }}>
        {prefix && <span style={{ color: "var(--muted)", fontSize: 14 }}>{prefix}</span>}
        <input type="number" value={val} step={step} onChange={e=>set(e.target.value===""?0:+e.target.value)} style={{ background: "none", border: "none", color: "var(--text)", fontSize: 15, padding: "10px 8px", width: "100%", outline: "none", fontFamily: "Inter" }} />
      </div>
    </div>
  );

  const positive = annualCashFlow >= 0;
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
      <h3 style={{ fontSize: 18, margin: "0 0 18px" }}>{tt(L.title)}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 14 }}>
        {field(tt(L.price), price, setPrice)}
        {field(tt(L.dp), dp, setDp, "", 5)}
        {field(tt(L.rate), rate, setRate, "", 0.25)}
        {field(tt(L.rent), rent, setRent, "$", 100)}
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{tt(L.term)}</label>
        <div style={{ display: "flex", gap: 8, maxWidth: 320 }}>
          {[15, 30].map((y) => (
            <button key={y} onClick={() => setTerm(y)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid var(--line)", background: term === y ? "var(--coral)" : "var(--bg)", color: term === y ? "#fff" : "var(--text)", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>{y} {lang === "ru" ? "лет" : "years"}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        {field(tt(L.tax), taxYr, setTaxYr, "$", 100)}
        {field(tt(L.ins), insYr, setInsYr, "$", 100)}
        {field(tt(L.hoa), hoaMo, setHoaMo, "$", 50)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginTop: 20 }}>
        <div style={{ background: "var(--bg)", borderRadius: 12, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 500, fontFamily: "Fraunces, serif", color: "var(--amber)" }}>{capRate.toFixed(1)}%</div>
          <div style={{ fontSize: 13, color: "var(--text)", marginTop: 6, fontWeight: 500 }}>{tt(L.cap)}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{tt(L.capSub)}</div>
        </div>
        <div style={{ background: "var(--bg)", borderRadius: 12, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 500, fontFamily: "Fraunces, serif", color: positive ? "var(--green)" : "#E2625C" }}>${Math.round(annualCashFlow).toLocaleString("en-US")}</div>
          <div style={{ fontSize: 13, color: "var(--text)", marginTop: 6, fontWeight: 500 }}>{tt(L.cf)}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{tt(L.cfSub)}</div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14, marginBottom: 0 }}>{tt(L.note)}</p>
    </div>
  );
}
