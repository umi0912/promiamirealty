"use client";
import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

// Блок-квалификатор «Работайте со мной, если… / Я не ваш агент, если…»
// Позиционирование broker & investor: отсеивает не-целевых, притягивает нужных.
export default function FitQualifier() {
  const { lang } = useLang();
  const tt = (en: string, ru: string) => (lang === "ru" ? ru : en);

  const yes = [
    tt("You want to buy below market — value with upside, not just any listing",
       "Вы хотите купить ниже рынка — объект с потенциалом роста, а не «просто квартиру»"),
    tt("You want an agent who reads the contract and protects your interests",
       "Вам нужен агент, который читает контракт и защищает ваши интересы"),
    tt("You value straight talk and strategy over a tour-guide who opens doors",
       "Вы цените прямоту и стратегию, а не агента, который просто открывает двери"),
    tt("You invest (or plan to) and the numbers matter — cap rate, cash flow, ROI",
       "Вы инвестируете или планируете — и для вас важны цифры: cap rate, доходность, cash flow"),
  ];
  const no = [
    tt("You just need someone to unlock the door at a showing",
       "Вам нужен просто кто-то, кто откроет дверь на показе"),
    tt("You're chasing the lowest commission at any cost",
       "Вы ищете самую низкую комиссию любой ценой"),
    tt("You're not open to an honest read on price and the market",
       "Вы не готовы услышать честную оценку цены и рынка"),
    tt("You want promises instead of real data and a clear plan",
       "Вам нужны обещания вместо реальных данных и чёткого плана"),
  ];

  const card = (
    title: string, items: string[], variant: "yes" | "no"
  ) => {
    const accent = variant === "yes" ? "var(--coral)" : "#C0492F";
    const mark = variant === "yes" ? "✓" : "✕";
    return (
      <div style={{
        background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18,
        padding: "28px 26px", borderTop: `3px solid ${accent}`,
      }}>
        <h3 style={{ fontSize: "clamp(18px,2.4vw,22px)", margin: "0 0 18px", color: "var(--text)" }}>{title}</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it, i) => (
            <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, lineHeight: 1.55, color: "var(--text)" }}>
              <span style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: variant === "yes" ? "rgba(44,90,80,.12)" : "rgba(192,73,47,.12)",
                color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, marginTop: 1,
              }}>{mark}</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(52px,9vw,96px) 24px 0" }}>
      <Reveal>
        <h2 style={{ fontSize: "clamp(26px,4vw,40px)", margin: "0 0 8px", textAlign: "center" }}>
          {tt("Are we a fit?", "Подходим ли мы друг другу?")}
        </h2>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 16, lineHeight: 1.6, maxWidth: 560, margin: "0 auto 32px" }}>
          {tt("I work best with a specific kind of client. Honest read below.",
              "Я работаю лучше всего с определённым типом клиентов. Честно — ниже.")}
        </p>
      </Reveal>
      <Reveal delay={80}>
        <div className="fitgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {card(tt("Work with me if…", "Работайте со мной, если…"), yes, "yes")}
          {card(tt("I'm probably not your agent if…", "Я, скорее всего, не ваш агент, если…"), no, "no")}
        </div>
      </Reveal>
      <style>{`@media(max-width:760px){ .fitgrid{ grid-template-columns:1fr !important; } }`}</style>
    </section>
  );
}
