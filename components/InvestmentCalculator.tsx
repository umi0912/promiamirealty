"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

export default function InvestmentCalculator() {
  const { lang } = useLang();
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
  const cashOnCash = down > 0 ? ((monthlyCashFlow * 12) / down) * 100 : 0;

  const L = {
    title: { en: "What you'd earn", ru: "Сколько вы заработаете" },
    price: { en: "Purchase price", ru: "Цена покупки" },
    dp: { en: "Down payment %", ru: "Первый взнос %" },
    rate: { en: "Interest rate %", ru: "Ставка по ипотеке %" },
    rent: { en: "Monthly rent income", ru: "Доход от аренды в месяц" },
    exp: { en: "Monthly expenses", ru: "Расходы в месяц" },
    cashflow: { en: "Money in your pocket / month", ru: "В карман в месяц" },
    cashflowSub: { en: "Rent minus mortgage and costs", ru: "Аренда минус ипотека и расходы" },
    coc: { en: "Return on your cash / year", ru: "Доходность на вложенные деньги / год" },
    cocSub: { en: "Annual profit vs. your down payment", ru: "Годовая прибыль к первому взносу" },
    note: { en: "Simple estimate. Assumes a 30-year loan. Doesn't include vacancy or one-time costs — ask for a full breakdown.", ru: "Упрощённая оценка. 30-летняя ипотека. Без учёта простоя и разовых затрат — полный расчёт по запросу." },
  };
  const tt = (o: { en: string; ru: string }) => o[lang];

  const field = (label: string, val: number, set: (n: number) => void, prefix = "$", step = 1000) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--line)", padding: "0 12px" }}>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>{prefix}</span>
        <input type="number" value={val} step={step} onChange={e=>set(+e.target.value||0)} style={{ background: "none", border: "none", color: "var(--text)", fontSize: 15, padding: "10px 8px", width: "100%", outline: "none", fontFamily: "Outfit" }} />
      </div>
    </div>
  );

  const positive = monthlyCashFlow >= 0;
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
      <h3 style={{ fontSize: 18, margin: "0 0 18px" }}>{tt(L.title)}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        {field(tt(L.price), price, setPrice)}
        {field(tt(L.dp), dp, setDp, "", 5)}
        {field(tt(L.rate), rate, setRate, "", 0.25)}
        {field(tt(L.rent), rent, setRent, "$", 100)}
        {field(tt(L.exp), expenses, setExpenses, "$", 100)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginTop: 18 }}>
        <div style={{ background: "var(--bg)", borderRadius: 12, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 500, fontFamily: "Fraunces, serif", color: positive ? "var(--green)" : "#E2625C" }}>${Math.round(monthlyCashFlow).toLocaleString("en-US")}</div>
          <div style={{ fontSize: 13, color: "var(--text)", marginTop: 6, fontWeight: 500 }}>{tt(L.cashflow)}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{tt(L.cashflowSub)}</div>
        </div>
        <div style={{ background: "var(--bg)", borderRadius: 12, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 500, fontFamily: "Fraunces, serif", color: "var(--amber)" }}>{cashOnCash.toFixed(1)}%</div>
          <div style={{ fontSize: 13, color: "var(--text)", marginTop: 6, fontWeight: 500 }}>{tt(L.coc)}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{tt(L.cocSub)}</div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14, marginBottom: 0 }}>{tt(L.note)}</p>
    </div>
  );
}
