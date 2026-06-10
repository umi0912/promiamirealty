"use client";
import { useLead } from "@/components/LeadModal";

type Intent = "buy" | "sell" | "invest";

export default function BookButton({
  intent = "buy",
  source,
  listingRef,
  label,
  variant = "solid",
  style,
}: {
  intent?: Intent;
  source?: string;
  listingRef?: string;
  label: string;
  variant?: "solid" | "outline";
  style?: React.CSSProperties;
}) {
  const { openLead } = useLead();
  const base: React.CSSProperties = {
    display: "inline-block", padding: "14px 30px", borderRadius: 999, fontSize: 15,
    fontWeight: 500, cursor: "pointer", border: "none", textAlign: "center",
  };
  const variantStyle: React.CSSProperties =
    variant === "outline"
      ? { background: "transparent", color: "var(--text)", border: "1px solid var(--line)" }
      : { background: "var(--coral)", color: "#fff" };
  return (
    <button onClick={() => openLead({ intent, source: source || "CTA", listingRef })} style={{ ...base, ...variantStyle, ...style }}>
      {label}
    </button>
  );
}
