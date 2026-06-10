"use client";
import { AGENT } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export default function CalcContactCTA() {
  const { lang } = useLang();
  const t = {
    line: {
      en: "Exact taxes and insurance? We'll help you confirm the real numbers.",
      ru: "Точные налог и страховку поможем уточнить — назовём реальные цифры.",
    },
    call: { en: "Call now", ru: "Позвонить" },
    book: { en: "Book a call", ru: "Записаться на звонок" },
  };
  const tt = (o: { en: string; ru: string }) => o[lang];

  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
      <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 12px", lineHeight: 1.5 }}>{tt(t.line)}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href={`tel:${AGENT.phoneRaw}`}
          style={{
            flex: "1 1 140px",
            textAlign: "center",
            background: "var(--coral)",
            color: "#fff",
            padding: "11px 18px",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {tt(t.call)} · {AGENT.phone}
        </a>
        <a
          href={AGENT.calendly}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: "1 1 140px",
            textAlign: "center",
            background: "transparent",
            color: "var(--text)",
            padding: "11px 18px",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            border: "1px solid var(--line)",
            whiteSpace: "nowrap",
          }}
        >
          {tt(t.book)}
        </a>
      </div>
    </div>
  );
}
