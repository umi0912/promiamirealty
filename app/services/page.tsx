"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";

type Step = "plans" | "pay" | "input" | "processing" | "result";
type PlanId = "review" | "prepare";

export default function Services() {
  const { lang } = useLang();
  const ru = lang === "ru";
  const [step, setStep] = useState<Step>("plans");
  const [plan, setPlan] = useState<PlanId | null>(null);
  const [filename, setFilename] = useState("");
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [deal, setDeal] = useState({ buyer: "", seller: "", property: "", price: "", closing: "", earnest: "" });
  const [result, setResult] = useState<any>(null);
  const [requestId, setRequestId] = useState<string>("");
  const [contact, setContact] = useState({ name: "", email: "" });
  const [paying, setPaying] = useState(false);

  // Возврат от Stripe: ?paid=1 → восстановить план/контакты и перейти к вводу данных.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      try {
        const saved = JSON.parse(sessionStorage.getItem("pmr_order") || "{}");
        if (saved.plan) {
          setPlan(saved.plan);
          setContact({ name: saved.name || "", email: saved.email || "" });
          setStep("input");
        }
      } catch {}
      window.history.replaceState({}, "", "/services");
    }
  }, []);

  const PLANS = {
    review: { price: 50, accent: "var(--green)", title: ru ? "Проверка контракта" : "Contract review", desc: ru ? "Загрузите контракт — AI найдёт пробелы и риски, агент проверит." : "Upload your contract — AI flags gaps and risks, agent reviews." },
    prepare: { price: 100, accent: "var(--coral)", title: ru ? "Подготовка контракта" : "Contract preparation", desc: ru ? "Введите данные сделки — AI готовит черновик, агент финализирует." : "Enter the deal details — AI drafts it, agent finalizes." },
  };

  const startPlan = (id: PlanId) => { setPlan(id); setStep("pay"); };

  const pay = async () => {
    if (!plan) return;
    if (!contact.name || !contact.email) return;
    setPaying(true);
    // сохраняем заказ, чтобы пережить редирект на Stripe и обратно
    sessionStorage.setItem("pmr_order", JSON.stringify({ plan, name: contact.name, email: contact.email }));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: PLANS[plan].price, title: PLANS[plan].title, planId: plan, origin: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }  // → Stripe Checkout
      // Stripe не настроен (configured:false) — фолбэк: продолжаем без оплаты (тест)
      setStep("input");
    } catch {
      setStep("input");
    }
    setPaying(false);
  };

  const runAI = async () => {
    setStep("processing");
    try {
      let filePath = "";
      // для review — сначала загружаем реальный PDF
      if (plan === "review" && fileObj) {
        const fd = new FormData();
        fd.append("file", fileObj);
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        const upData = await up.json();
        if (upData.ok) filePath = upData.path;
      }
      const payload = plan === "prepare"
        ? { mode: "prepare", deal, client_name: contact.name, client_email: contact.email }
        : { mode: "review", filename, file_path: filePath, client_name: contact.name, client_email: contact.email };
      const res = await fetch("/api/contract-ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      setResult(data.result);
      setRequestId(data.requestId || "");
    } catch {
      setResult(null);
    }
    setStep("result");
  };

  const reset = () => { setStep("plans"); setPlan(null); setResult(null); setFilename(""); setFileObj(null); };

  const inp: React.CSSProperties = { width: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "12px 14px", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Outfit" };
  const lab: React.CSSProperties = { fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };

  const StepDots = () => {
    const steps = ["plans", "pay", "input", "result"];
    const cur = step === "processing" ? 2 : steps.indexOf(step);
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: i === cur ? 28 : 8, height: 8, borderRadius: 999, background: i <= cur ? "var(--coral)" : "var(--surface-2)", transition: "all .3s" }} />
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14, textAlign: "center" }}>{ru ? "Услуги" : "Services"}</div>
      <h1 style={{ fontSize: "clamp(30px,5vw,48px)", margin: "0 0 12px", lineHeight: 1.05, textAlign: "center" }}>{ru ? "Помощь с контрактами" : "Contract help, on demand"}</h1>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--muted)", maxWidth: 540, margin: "0 auto 16px", textAlign: "center" }}>
        {ru ? "Быстрая AI-проверка или подготовка контракта — с финальной проверкой лицензированного агента." : "Fast AI-assisted review or preparation — with a final check by a licensed agent."}
      </p>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <span style={{ fontSize: 12, color: "var(--green)", background: "rgba(63,185,132,.12)", padding: "6px 14px", borderRadius: 999 }}>
          {ru ? "✓ Каждый результат проверяет Ays Iziken перед отправкой" : "✓ Every result reviewed by Ays Iziken before delivery"}
        </span>
      </div>

      <StepDots />

      {/* STEP: PLANS */}
      {step === "plans" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {(["review", "prepare"] as PlanId[]).map(id => {
            const p = PLANS[id];
            return (
              <div key={id} style={{ background: "var(--surface)", borderRadius: 20, padding: 28, border: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 19, fontFamily: "Fraunces, serif", fontWeight: 500 }}>{p.title}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "14px 0" }}>
                  <span style={{ fontSize: 44, fontWeight: 500, fontFamily: "Fraunces, serif", color: p.accent }}>${p.price}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, margin: "0 0 24px", flex: 1 }}>{p.desc}</p>
                <button onClick={() => startPlan(id)} style={{ background: p.accent, color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit" }}>
                  {ru ? "Выбрать" : "Choose"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP: PAY */}
      {step === "pay" && plan && (
        <div style={{ background: "var(--surface)", borderRadius: 20, padding: 28, border: "1px solid var(--line)", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontSize: 19, fontFamily: "Fraunces, serif", fontWeight: 500, marginBottom: 4 }}>{PLANS[plan].title}</div>
          <div style={{ fontSize: 32, fontWeight: 500, fontFamily: "Fraunces, serif", color: PLANS[plan].accent, marginBottom: 18 }}>${PLANS[plan].price}</div>
          <input style={{ ...inp, marginBottom: 12 }} placeholder={ru ? "Ваше имя" : "Your name"} value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />
          <input style={{ ...inp, marginBottom: 18 }} placeholder="Email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
          <button onClick={pay} disabled={paying || !contact.name || !contact.email} style={{ width: "100%", background: PLANS[plan].accent, color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", opacity: paying || !contact.name || !contact.email ? 0.5 : 1, fontFamily: "Outfit" }}>
            {paying ? (ru ? "Перенаправление…" : "Redirecting…") : (ru ? `Оплатить $${PLANS[plan].price} картой` : `Pay $${PLANS[plan].price} by card`)}
          </button>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, textAlign: "center" }}>{ru ? "Безопасная оплата картой через Stripe" : "Secure card payment via Stripe"}</p>
          <button onClick={reset} style={{ width: "100%", marginTop: 8, background: "none", border: "none", color: "var(--muted)", fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>← {ru ? "Назад" : "Back"}</button>
        </div>
      )}

      {/* STEP: INPUT */}
      {step === "input" && plan === "review" && (
        <div style={{ background: "var(--surface)", borderRadius: 20, padding: 28, border: "1px solid var(--line)", maxWidth: 520, margin: "0 auto" }}>
          <h3 style={{ fontSize: 18, margin: "0 0 6px" }}>{ru ? "Загрузите контракт" : "Upload your contract"}</h3>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 18px" }}>{ru ? "PDF вашего контракта или листинга." : "PDF of your contract or listing."}</p>
          <label style={{ display: "block", border: "1.5px dashed var(--line)", borderRadius: 12, padding: 32, textAlign: "center", cursor: "pointer", background: "var(--bg)" }}>
            <input type="file" accept="application/pdf" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; setFileObj(f || null); setFilename(f?.name || ""); }} />
            <div style={{ fontSize: 14, color: filename ? "var(--text)" : "var(--muted)" }}>{filename || (ru ? "Нажмите, чтобы выбрать PDF" : "Click to choose a PDF")}</div>
          </label>
          <button onClick={runAI} disabled={!filename} style={{ width: "100%", marginTop: 18, background: "var(--green)", color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", opacity: filename ? 1 : 0.5, fontFamily: "Outfit" }}>
            {ru ? "Проверить контракт" : "Review contract"}
          </button>
        </div>
      )}

      {step === "input" && plan === "prepare" && (
        <div style={{ background: "var(--surface)", borderRadius: 20, padding: 28, border: "1px solid var(--line)", maxWidth: 560, margin: "0 auto" }}>
          <h3 style={{ fontSize: 18, margin: "0 0 6px" }}>{ru ? "Данные сделки" : "Deal details"}</h3>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 18px" }}>{ru ? "Заполните — AI подготовит черновик." : "Fill in — AI prepares a draft."}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lab}>{ru ? "Покупатель" : "Buyer"}</label><input style={inp} value={deal.buyer} onChange={e => setDeal({ ...deal, buyer: e.target.value })} /></div>
            <div><label style={lab}>{ru ? "Продавец" : "Seller"}</label><input style={inp} value={deal.seller} onChange={e => setDeal({ ...deal, seller: e.target.value })} /></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={lab}>{ru ? "Адрес объекта" : "Property address"}</label><input style={inp} value={deal.property} onChange={e => setDeal({ ...deal, property: e.target.value })} /></div>
            <div><label style={lab}>{ru ? "Цена $" : "Price $"}</label><input style={inp} value={deal.price} onChange={e => setDeal({ ...deal, price: e.target.value })} /></div>
            <div><label style={lab}>{ru ? "Дата закрытия" : "Closing date"}</label><input style={inp} value={deal.closing} onChange={e => setDeal({ ...deal, closing: e.target.value })} /></div>
            <div><label style={lab}>{ru ? "Задаток $" : "Earnest money $"}</label><input style={inp} value={deal.earnest} onChange={e => setDeal({ ...deal, earnest: e.target.value })} /></div>
          </div>
          <button onClick={runAI} style={{ width: "100%", marginTop: 18, background: "var(--coral)", color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit" }}>
            {ru ? "Подготовить черновик" : "Prepare draft"}
          </button>
        </div>
      )}

      {/* STEP: PROCESSING */}
      {step === "processing" && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="spin" style={{ width: 44, height: 44, border: "3px solid var(--surface-2)", borderTopColor: "var(--coral)", borderRadius: "50%", margin: "0 auto 20px" }} />
          <div style={{ fontSize: 16, color: "var(--text)" }}>{ru ? "AI обрабатывает…" : "AI is working…"}</div>
          <style>{`.spin{ animation: spin 0.8s linear infinite; } @keyframes spin{ to{ transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* STEP: RESULT */}
      {step === "result" && result && (
        <div style={{ background: "var(--surface)", borderRadius: 20, padding: 28, border: "1px solid var(--line)" }}>
          <div style={{ fontSize: 18, fontFamily: "Fraunces, serif", fontWeight: 500, marginBottom: 4 }}>{result.summary}</div>
          {result.findings && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
              {result.findings.map((f: any, i: number) => {
                const c = f.level === "warning" ? "var(--amber)" : f.level === "ok" ? "var(--green)" : "var(--violet)";
                return (
                  <div key={i} style={{ background: "var(--bg)", borderRadius: 12, padding: 14, borderLeft: `3px solid ${c}` }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{f.detail}</div>
                  </div>
                );
              })}
            </div>
          )}
          {result.preview && (
            <div style={{ marginTop: 18, background: "var(--bg)", borderRadius: 12, padding: 18 }}>
              {result.preview.map(([k, v]: [string, string], i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < result.preview.length - 1 ? "1px solid var(--line)" : "none" }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{k}</span>
                  <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ background: "rgba(63,185,132,.1)", borderRadius: 12, padding: 14, marginTop: 18, fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>
            👤 {ru ? "Это AI-черновик. Ays Iziken проверит его и пришлёт вам финальный результат на email." : "This is an AI draft. Ays Iziken will review it and send you the final result by email."}
            {requestId && <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>{ru ? "Номер заявки" : "Request"}: #{requestId}</div>}
          </div>
          <button onClick={reset} style={{ width: "100%", marginTop: 18, background: "var(--surface-2)", color: "var(--text)", border: "none", padding: "13px", borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit" }}>
            {ru ? "Готово" : "Done"}
          </button>
        </div>
      )}
    </div>
  );
}
