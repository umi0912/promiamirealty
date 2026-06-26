"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

// Предварительная оценка: площадь × ориентир цены за sqft. НЕ официальная — точную даёт агент по компам.
const PPSF: Record<string, number> = { condo: 620, house: 410, townhouse: 470 };

export default function HomeValuation() {
  const { lang } = useLang();
  const tt = (en: string, ru: string) => (lang === "ru" ? ru : en);
  const [done, setDone] = useState(false);
  const [type, setType] = useState("house");
  const [sqft, setSqft] = useState(1800);
  const [beds, setBeds] = useState(3);
  const [zip, setZip] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const base = sqft * (PPSF[type] || 450);
  const low = Math.round((base * 0.92) / 1000) * 1000;
  const high = Math.round((base * 1.08) / 1000) * 1000;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US");

  const submit = async () => {
    if (!name.trim() || (!phone.trim() && !address.trim())) {
      setErr(tt("Add your name and a phone or address.", "Укажите имя и телефон или адрес."));
      return;
    }
    setErr(""); setBusy(true);
    try {
      await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email: "", address, message: `Home valuation request — ${type}, ~${sqft}sqft, ${beds}bd, zip:${zip}. Est. ${fmt(low)}–${fmt(high)}. Wants a call with an offer.` }),
      });
    } catch {}
    setBusy(false); setDone(true);
  };

  const inp: React.CSSProperties = { width: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "12px 14px", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Inter" };
  const sel: React.CSSProperties = { ...inp, appearance: "auto" as const };
  const lab: React.CSSProperties = { fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };

  if (done) return (
    <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 22, fontFamily: "Space Grotesk, sans-serif", marginBottom: 8 }}>{tt("Request received", "Заявка принята")}</div>
      <p style={{ color: "var(--muted)", fontSize: 15, margin: 0, lineHeight: 1.7 }}>{tt("Ays will reach out shortly with a precise, comp-based valuation and an offer strategy.", "Ays скоро свяжется с точной оценкой по компам и стратегией продажи.")}</p>
    </div>
  );

  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 28 }}>
      <h3 style={{ fontSize: 18, margin: "0 0 18px" }}>{tt("Estimate your home's value", "Оцените стоимость дома")}</h3>

      {/* ОЦЕНКА — поля в один ряд */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }} className="hv-row">
        <div><label style={lab}>{tt("Property type", "Тип")}</label><select style={sel} value={type} onChange={e => setType(e.target.value)}><option value="house">{tt("Single family", "Дом")}</option><option value="condo">{tt("Condo", "Кондо")}</option><option value="townhouse">{tt("Townhouse", "Таунхаус")}</option></select></div>
        <div><label style={lab}>{tt("Living area (sqft)", "Площадь (sqft)")}</label><input style={inp} type="number" value={sqft} step={50} onChange={e => setSqft(+e.target.value || 0)} /></div>
        <div><label style={lab}>{tt("Bedrooms", "Спальни")}</label><select style={sel} value={beds} onChange={e => setBeds(+e.target.value)}>{[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
        <div><label style={lab}>{tt("ZIP code", "ZIP-код")}</label><input style={inp} value={zip} placeholder="33027" onChange={e => setZip(e.target.value)} /></div>
      </div>

      {/* диапазон */}
      <div style={{ background: "var(--bg)", borderRadius: 12, padding: "14px 20px", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{tt("Estimated value range", "Ориентировочный диапазон")}</span>
        <span style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, fontFamily: "Space Grotesk, sans-serif", color: "var(--indigo)" }}>{fmt(low)} – {fmt(high)}</span>
      </div>

      {/* ЛИД — имя, телефон, адрес */}
      <div style={{ borderTop: "1px solid var(--line)", marginTop: 20, paddingTop: 18 }}>
        <p style={{ fontSize: 14, color: "var(--text)", margin: "0 0 14px", fontWeight: 500 }}>{tt("Leave your details — Ays will call you with a precise valuation and an offer strategy.", "Оставьте контакты — Ays перезвонит с точной оценкой и стратегией продажи.")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 12 }} className="hv-row">
          <input style={inp} placeholder={tt("Your name", "Ваше имя")} value={name} onChange={e => setName(e.target.value)} />
          <input style={inp} placeholder={tt("Phone", "Телефон")} value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" />
          <input style={inp} placeholder={tt("Property address", "Адрес объекта")} value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        {err && <p style={{ color: "#E2625C", fontSize: 13, margin: "10px 0 0" }}>{err}</p>}
        <button onClick={submit} disabled={busy} style={{ width: "100%", marginTop: 14, background: "var(--coral)", color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1, fontFamily: "Inter" }}>
          {busy ? tt("Sending…", "Отправка…") : tt("Request my valuation →", "Получить оценку →")}
        </button>
        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, marginBottom: 0 }}>{tt("Free, no obligation. A precise valuation uses recent comparable sales.", "Бесплатно, без обязательств. Точная оценка — по недавним сделкам-аналогам.")}</p>
      </div>
      <style>{`@media(max-width:640px){ .hv-row{ grid-template-columns:1fr 1fr !important; } }`}</style>
    </div>
  );
}
