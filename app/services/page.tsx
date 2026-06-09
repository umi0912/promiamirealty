"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

type Plan = { id: string; price: number; titleEn: string; titleRu: string; descEn: string; descRu: string; featuresEn: string[]; featuresRu: string[]; accent: string };

const PLANS: Plan[] = [
  {
    id: "contract-review", price: 50, accent: "var(--green)",
    titleEn: "Contract review", titleRu: "Проверка контракта",
    descEn: "Upload your listing or contract — get it checked for issues before you sign.",
    descRu: "Загрузите листинг или контракт — проверим на ошибки до подписания.",
    featuresEn: ["Review of your document", "Flags missing or risky terms", "Written notes back within 48h"],
    featuresRu: ["Проверка вашего документа", "Отметим спорные и упущенные пункты", "Письменные замечания в течение 48ч"],
  },
  {
    id: "contract-prep", price: 100, accent: "var(--coral)",
    titleEn: "Contract preparation", titleRu: "Подготовка контракта",
    descEn: "We prepare the full contract for you — filled in, ready to sign.",
    descRu: "Готовим полный контракт за вас — заполнен и готов к подписанию.",
    featuresEn: ["Full contract drafted for you", "All client & property data filled in", "Ready-to-sign document", "One round of edits included"],
    featuresRu: ["Полный контракт под ключ", "Все данные клиента и объекта внесены", "Документ готов к подписанию", "Один раунд правок включён"],
  },
];

export default function Services() {
  const { lang } = useLang();
  const [busy, setBusy] = useState<string | null>(null);

  const checkout = async (plan: Plan) => {
    setBusy(plan.id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, price: plan.price, title: lang === "ru" ? plan.titleRu : plan.titleEn }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      alert(lang === "ru" ? "Оплата скоро будет подключена. Свяжитесь с нами напрямую." : "Payments are being set up. Please reach out directly for now.");
    } catch {
      alert(lang === "ru" ? "Оплата скоро будет подключена." : "Payments are being set up.");
    }
    setBusy(null);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>{lang === "ru" ? "Услуги" : "Services"}</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 16px", lineHeight: 1.05 }}>{lang === "ru" ? "Помощь с контрактами" : "Contract help, on demand"}</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted)", maxWidth: 560 }}>
        {lang === "ru" ? "Для агентов и клиентов: проверим ваш контракт или подготовим новый. Оплата прямо на сайте, результат — быстро." : "For agents and clients: have your contract reviewed, or have a new one prepared. Pay online, get it done fast."}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginTop: 44 }}>
        {PLANS.map(p => (
          <div key={p.id} style={{ background: "var(--surface)", borderRadius: 20, padding: 28, border: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 19, fontFamily: "Fraunces, serif", fontWeight: 500 }}>{lang === "ru" ? p.titleRu : p.titleEn}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "14px 0" }}>
              <span style={{ fontSize: 44, fontWeight: 500, fontFamily: "Fraunces, serif", color: p.accent }}>${p.price}</span>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>{lang === "ru" ? "/ услуга" : "/ service"}</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, margin: "0 0 18px" }}>{lang === "ru" ? p.descRu : p.descEn}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {(lang === "ru" ? p.featuresRu : p.featuresEn).map((f, i) => (
                <li key={i} style={{ fontSize: 14, color: "var(--text)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: p.accent, flexShrink: 0 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={() => checkout(p)} disabled={busy === p.id} style={{ background: p.accent, color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", opacity: busy === p.id ? 0.6 : 1, fontFamily: "Outfit" }}>
              {busy === p.id ? "…" : (lang === "ru" ? `Оплатить $${p.price}` : `Pay $${p.price}`)}
            </button>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 24, textAlign: "center" }}>
        {lang === "ru" ? "Безопасная оплата картой через Stripe. После оплаты — инструкция по загрузке документа." : "Secure card payment via Stripe. After payment, you'll get instructions to upload your document."}
      </p>
    </div>
  );
}
