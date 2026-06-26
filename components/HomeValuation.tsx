"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

// Форма продавца: детали дома + желаемая цена + контакты → заявка уходит Ays (звонок с оффером).
export default function HomeValuation() {
  const { lang } = useLang();
  const tt = (en: string, ru: string) => (lang === "ru" ? ru : en);
  const [done, setDone] = useState(false);
  const [type, setType] = useState("house");
  const [sqft, setSqft] = useState(1800);
  const [beds, setBeds] = useState(3);
  const [zip, setZip] = useState("");
  const [price, setPrice] = useState("");        // желаемая цена продажи
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!name.trim() || (!phone.trim() && !address.trim())) {
      setErr(tt("Add your name and a phone or address.", "Укажите имя и телефон или адрес."));
      return;
    }
    setErr(""); setBusy(true);
    try {
      await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, email: "", address,
          message: `Seller request — ${type}, ~${sqft}sqft, ${beds}bd, zip:${zip}. Wants to sell for: ${price || "—"}. Address: ${address || "—"}. Asking for a call with an offer strategy.`,
        }),
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
      <p style={{ color: "var(--muted)", fontSize: 15, margin: 0, lineHeight: 1.7 }}>{tt("Ays will call you shortly with a precise, comp-based valuation and an offer strategy.", "Ays скоро перезвонит с точной оценкой по компам и стратегией продажи.")}</p>
    </div>
  );

  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 28 }}>
      <h3 style={{ fontSize: 18, margin: "0 0 18px" }}>{tt("Tell Ays about your home", "Расскажите Ays о вашем доме")}</h3>

      {/* детали дома в один ряд */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }} className="hv-row">
        <div><label style={lab}>{tt("Property type", "Тип")}</label><select style={sel} value={type} onChange={e => setType(e.target.value)}><option value="house">{tt("Single family", "Дом")}</option><option value="condo">{tt("Condo", "Кондо")}</option><option value="townhouse">{tt("Townhouse", "Таунхаус")}</option></select></div>
        <div><label style={lab}>{tt("Living area (sqft)", "Площадь (sqft)")}</label><input style={inp} type="number" value={sqft} step={50} onChange={e => setSqft(+e.target.value || 0)} /></div>
        <div><label style={lab}>{tt("Bedrooms", "Спальни")}</label><select style={sel} value={beds} onChange={e => setBeds(+e.target.value)}>{[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
        <div><label style={lab}>{tt("ZIP code", "ZIP-код")}</label><input style={inp} value={zip} placeholder="33027" onChange={e => setZip(e.target.value)} /></div>
      </div>

      {/* желаемая цена — крупное поле */}
      <div style={{ marginTop: 18 }}>
        <label style={lab}>{tt("Your target sale price", "Желаемая цена продажи")}</label>
        <div style={{ display: "flex", alignItems: "center", background: "var(--bg)", borderRadius: 12, border: "1px solid var(--line)", padding: "0 18px" }}>
          <span style={{ fontSize: 26, color: "var(--muted)", fontFamily: "Space Grotesk, sans-serif" }}>$</span>
          <input value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9,]/g, ""))} inputMode="numeric" placeholder={tt("e.g. 750,000", "напр. 750,000")}
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--indigo)", fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, fontFamily: "Space Grotesk, sans-serif", padding: "12px 8px" }} />
        </div>
      </div>

      {/* контакты */}
      <div style={{ borderTop: "1px solid var(--line)", marginTop: 20, paddingTop: 18 }}>
        <p style={{ fontSize: 14, color: "var(--text)", margin: "0 0 14px", fontWeight: 500 }}>{tt("Leave your details — Ays will call you with a precise valuation and an offer strategy.", "Оставьте контакты — Ays перезвонит с точной оценкой и стратегией продажи.")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 12 }} className="hv-row">
          <input style={inp} placeholder={tt("Your name", "Ваше имя")} value={name} onChange={e => setName(e.target.value)} />
          <input style={inp} placeholder={tt("Phone", "Телефон")} value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" />
          <input style={inp} placeholder={tt("Property address", "Адрес объекта")} value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        {err && <p style={{ color: "#E2625C", fontSize: 13, margin: "10px 0 0" }}>{err}</p>}
        <button onClick={submit} disabled={busy} style={{ width: "100%", marginTop: 14, background: "var(--coral)", color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1, fontFamily: "Inter" }}>
          {busy ? tt("Sending…", "Отправка…") : tt("Request a call →", "Запросить звонок →")}
        </button>
        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, marginBottom: 0 }}>{tt("Free, no obligation. Ays will confirm a precise price from recent comparable sales.", "Бесплатно, без обязательств. Ays подтвердит точную цену по недавним сделкам-аналогам.")}</p>
      </div>
      <style>{`@media(max-width:640px){ .hv-row{ grid-template-columns:1fr 1fr !important; } }`}</style>
    </div>
  );
}
