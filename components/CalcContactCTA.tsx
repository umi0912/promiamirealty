"use client";
import { AGENT } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { useLead } from "@/components/LeadModal";

export default function CalcContactCTA({
  calcKind,
  snapshot,
  listingRef,
  source,
}: {
  calcKind?: "mortgage" | "investment";
  snapshot?: Record<string, any>;
  listingRef?: string;
  source?: string;
}) {
  const { lang } = useLang();
  const { openLead } = useLead();
  const tt = (en: string, ru: string) => (lang === "ru" ? ru : en);

  const open = () =>
    openLead({
      intent: calcKind === "investment" ? "invest" : "buy",
      calcKind,
      calcSnapshot: snapshot,
      listingRef,
      source: source || (calcKind === "investment" ? "Investment calculator" : "Mortgage calculator"),
    });

  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
      <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 12px", lineHeight: 1.5 }}>
        {tt(
          "Exact taxes and insurance? We'll help you confirm the real numbers.",
          "Точные налог и страховку поможем уточнить — назовём реальные цифры."
        )}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={open}
          style={{
            flex: "1 1 150px", textAlign: "center", background: "var(--coral)", color: "#fff",
            padding: "12px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500, border: "none",
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          {tt("Book a call", "Записаться на звонок")}
        </button>
        <a
          href={`tel:${AGENT.phoneRaw}`}
          style={{
            flex: "1 1 150px", textAlign: "center", background: "transparent", color: "var(--text)",
            padding: "12px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: "none",
            border: "1px solid var(--line)", whiteSpace: "nowrap",
          }}
        >
          {tt("Call now", "Позвонить")} · {AGENT.phone}
        </a>
      </div>
    </div>
  );
}
