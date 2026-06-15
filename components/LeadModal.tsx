"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AGENT } from "@/lib/data";
import { useLang } from "@/lib/i18n";

type Intent = "buy" | "sell" | "invest";

interface OpenOptions {
  intent?: Intent;
  source?: string;
  listingRef?: string;
  calcKind?: "mortgage" | "investment";
  calcSnapshot?: Record<string, any>;
}

interface LeadCtx {
  openLead: (opts?: OpenOptions) => void;
}
const Ctx = createContext<LeadCtx>({ openLead: () => {} });
export const useLead = () => useContext(Ctx);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOptions>({});

  const openLead = useCallback((o: OpenOptions = {}) => {
    setOpts(o);
    setOpen(true);
  }, []);

  return (
    <Ctx.Provider value={{ openLead }}>
      {children}
      {open && <LeadModal opts={opts} onClose={() => setOpen(false)} />}
    </Ctx.Provider>
  );
}

function LeadModal({ opts, onClose }: { opts: OpenOptions; onClose: () => void }) {
  const { lang } = useLang();
  const tt = (en: string, ru: string) => (lang === "ru" ? ru : en);

  const [intent, setIntent] = useState<Intent>(opts.intent || "buy");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bestTime, setBestTime] = useState("");
  // sell
  const [sAddr, setSAddr] = useState("");
  const [sType, setSType] = useState("");
  const [sPrice, setSPrice] = useState("");
  const [sMortgage, setSMortgage] = useState("");
  const [sTimeline, setSTimeline] = useState("");
  // buy / invest
  const [bBudget, setBBudget] = useState("");
  const [bAreas, setBAreas] = useState("");
  const [bType, setBType] = useState("");

  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const inp: React.CSSProperties = {
    width: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10,
    padding: "11px 12px", color: "var(--text)", fontSize: 15, outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = { fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };

  const intentBtn = (val: Intent, label: string) => (
    <button onClick={() => setIntent(val)} style={{
      flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid var(--line)",
      background: intent === val ? "var(--coral)" : "var(--bg)", color: intent === val ? "#fff" : "var(--text)",
      fontSize: 14, fontWeight: 500, cursor: "pointer",
    }}>{label}</button>
  );

  function buildCalendlyUrl(): string {
    const parts: string[] = [];
    if (intent === "sell") {
      if (sAddr) parts.push(`Address: ${sAddr}`);
      if (sType) parts.push(`Type: ${sType}`);
      if (sPrice) parts.push(`Price: ${sPrice}`);
      if (sMortgage) parts.push(`Mortgage: ${sMortgage}`);
      if (sTimeline) parts.push(`Timeline: ${sTimeline}`);
    } else {
      if (bBudget) parts.push(`Budget: ${bBudget}`);
      if (bAreas) parts.push(`Areas: ${bAreas}`);
      if (bType) parts.push(`Type: ${bType}`);
    }
    if (opts.calcSnapshot) {
      const s = opts.calcSnapshot;
      parts.push(opts.calcKind === "investment"
        ? `Calc: cap ${s.capRate}%, cash flow $${s.annualCashFlow}/yr`
        : `Calc: payment $${s.total}/mo`);
    }
    const intentWord = intent === "sell" ? "Selling" : intent === "invest" ? "Investing" : "Buying";
    const note = `[${intentWord}] ${parts.join(" · ")}`;
    const q = new URLSearchParams();
    if (name) q.set("name", name);
    if (email) q.set("email", email);
    q.set("a1", note.slice(0, 250));
    return `${AGENT.calendly}?${q.toString()}`;
  }

  async function submit(goCalendly: boolean) {
    setErr("");
    if (!name.trim()) { setErr(tt("Please enter your name", "Введите имя")); return; }
    if (!phone.trim() && !email.trim()) { setErr(tt("Add a phone or email", "Укажите телефон или email")); return; }
    setSending(true);
    const payload = {
      name, phone, email, best_time: bestTime, intent,
      sell_address: sAddr, sell_property_type: sType, sell_price_expect: sPrice,
      sell_has_mortgage: sMortgage, sell_timeline: sTimeline,
      buy_budget: bBudget, buy_areas: bAreas, buy_property_type: bType,
      buy_purpose: intent === "invest" ? "invest" : "live",
      calc_kind: opts.calcKind || null,
      calc_snapshot: opts.calcSnapshot || null,
      source: opts.source || "website",
      listing_ref: opts.listingRef || null,
    };
    try {
      await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch { /* лид-письмо не критично для UX */ }
    setSending(false);
    if (goCalendly) {
      window.open(buildCalendlyUrl(), "_blank", "noopener");
    }
    onClose();
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,8,14,.72)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", borderRadius: 18, border: "1px solid var(--line)",
        width: "100%", maxWidth: 480, padding: 26, maxHeight: "92vh", overflowY: "auto", position: "relative",
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: "absolute", top: 16, right: 16, background: "none", border: "none",
          color: "var(--muted)", fontSize: 22, cursor: "pointer", lineHeight: 1,
        }}>×</button>

        <h3 style={{ fontSize: 20, margin: "0 0 6px", fontFamily: "Space Grotesk, sans-serif" }}>{tt("Talk to Ays", "Связаться с Ays")}</h3>
        <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.5 }}>
          {tt("A few details so she can help you before the call.", "Пара деталей, чтобы она подготовилась к звонку.")}
        </p>

        <label style={lbl}>{tt("I want to", "Я хочу")}</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {intentBtn("buy", tt("Buy", "Купить"))}
          {intentBtn("sell", tt("Sell", "Продать"))}
          {intentBtn("invest", tt("Invest", "Инвестировать"))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={lbl}>{tt("Name", "Имя")}</label><input style={inp} value={name} onChange={e => setName(e.target.value)} /></div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><label style={lbl}>{tt("Phone", "Телефон")}</label><input style={inp} value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" /></div>
            <div style={{ flex: 1 }}><label style={lbl}>Email</label><input style={inp} value={email} onChange={e => setEmail(e.target.value)} inputMode="email" /></div>
          </div>

          {intent === "sell" ? (
            <>
              <div><label style={lbl}>{tt("Property address", "Адрес объекта")}</label><input style={inp} value={sAddr} onChange={e => setSAddr(e.target.value)} placeholder={tt("Street, city, ZIP", "Улица, город, ZIP")} /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}><label style={lbl}>{tt("Type", "Тип")}</label>
                  <select style={inp} value={sType} onChange={e => setSType(e.target.value)}>
                    <option value="">{tt("Select", "Выбрать")}</option>
                    <option value="condo">{tt("Condo", "Кондо")}</option>
                    <option value="house">{tt("House", "Дом")}</option>
                    <option value="townhouse">{tt("Townhouse", "Таунхаус")}</option>
                    <option value="other">{tt("Other", "Другое")}</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}><label style={lbl}>{tt("Price hope", "Желаемая цена")}</label><input style={inp} value={sPrice} onChange={e => setSPrice(e.target.value)} placeholder="$" /></div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}><label style={lbl}>{tt("Mortgage/lien?", "Ипотека/залог?")}</label>
                  <select style={inp} value={sMortgage} onChange={e => setSMortgage(e.target.value)}>
                    <option value="">{tt("Select", "Выбрать")}</option>
                    <option value="no">{tt("No", "Нет")}</option>
                    <option value="yes">{tt("Yes", "Да")}</option>
                    <option value="unsure">{tt("Not sure", "Не знаю")}</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}><label style={lbl}>{tt("Timeline", "Сроки")}</label>
                  <select style={inp} value={sTimeline} onChange={e => setSTimeline(e.target.value)}>
                    <option value="">{tt("Select", "Выбрать")}</option>
                    <option value="asap">{tt("ASAP", "Срочно")}</option>
                    <option value="3m">{tt("1–3 months", "1–3 мес")}</option>
                    <option value="6m">{tt("3–6 months", "3–6 мес")}</option>
                    <option value="exploring">{tt("Just exploring", "Присматриваюсь")}</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}><label style={lbl}>{tt("Budget", "Бюджет")}</label><input style={inp} value={bBudget} onChange={e => setBBudget(e.target.value)} placeholder="$" /></div>
                <div style={{ flex: 1 }}><label style={lbl}>{tt("Type", "Тип")}</label>
                  <select style={inp} value={bType} onChange={e => setBType(e.target.value)}>
                    <option value="">{tt("Select", "Выбрать")}</option>
                    <option value="condo">{tt("Condo", "Кондо")}</option>
                    <option value="house">{tt("House", "Дом")}</option>
                    <option value="townhouse">{tt("Townhouse", "Таунхаус")}</option>
                    <option value="any">{tt("Any", "Любой")}</option>
                  </select>
                </div>
              </div>
              <div><label style={lbl}>{tt("Areas of interest", "Интересные районы")}</label><input style={inp} value={bAreas} onChange={e => setBAreas(e.target.value)} placeholder={tt("Miami Beach, Hollywood…", "Miami Beach, Hollywood…")} /></div>
            </>
          )}

          <div><label style={lbl}>{tt("Best time to call", "Когда удобно звонить")}</label><input style={inp} value={bestTime} onChange={e => setBestTime(e.target.value)} placeholder={tt("e.g. weekdays after 6pm", "напр. будни после 18:00")} /></div>
        </div>

        {err && <p style={{ color: "#E2625C", fontSize: 13, margin: "12px 0 0" }}>{err}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
          <button disabled={sending} onClick={() => submit(true)} style={{
            background: "var(--coral)", color: "#fff", border: "none", padding: "13px", borderRadius: 999,
            fontSize: 15, fontWeight: 500, cursor: sending ? "default" : "pointer", opacity: sending ? .6 : 1,
          }}>{sending ? tt("Sending…", "Отправка…") : tt("Pick a time on the calendar", "Выбрать время в календаре")}</button>
          <button disabled={sending} onClick={() => submit(false)} style={{
            background: "transparent", color: "var(--text)", border: "1px solid var(--line)", padding: "12px", borderRadius: 999,
            fontSize: 14, fontWeight: 500, cursor: sending ? "default" : "pointer",
          }}>{tt("Just have her call me", "Пусть она перезвонит мне")}</button>
          <a href={`tel:${AGENT.phoneRaw}`} style={{
            textAlign: "center", color: "var(--muted)", fontSize: 13, textDecoration: "none", padding: "4px",
          }}>{tt("or call now", "или позвонить сейчас")} · {AGENT.phone}</a>
        </div>
      </div>
    </div>
  );
}
