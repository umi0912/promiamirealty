"use client";
import { AGENT } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import MortgageCalculator from "@/components/MortgageCalculator";

export default function Buyers() {
  const { t } = useLang();
  const steps: [string, string][] = [
    [t("buyers.s1t"), t("buyers.s1d")],
    [t("buyers.s2t"), t("buyers.s2d")],
    [t("buyers.s3t"), t("buyers.s3d")],
    [t("buyers.s4t"), t("buyers.s4d")],
  ];
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>{t("buyers.eyebrow")}</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 16px", lineHeight: 1.05, maxWidth: 720 }}>{t("buyers.title")}</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted)", maxWidth: 600 }}>{t("buyers.sub")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 48 }}>
        {steps.map(([title, d], i) => (
          <div key={i} style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
            <div style={{ fontSize: 13, color: "var(--coral)", fontWeight: 500, marginBottom: 10 }}>{t("step")} {i + 1}</div>
            <div style={{ fontSize: 17, fontFamily: "Fraunces, serif", fontWeight: 500, marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontSize: "clamp(26px,3.5vw,34px)", marginBottom: 8 }}>{t("buyers.calcTitle")}</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 0, marginBottom: 24, maxWidth: 520 }}>{t("buyers.calcSub")}</p>
        <MortgageCalculator price={650000} />
      </div>

      <div style={{ marginTop: 32, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 15, color: "var(--muted)" }}>{t("buyers.invLink")}</div>
        <a href="/investors" style={{ color: "var(--coral)", fontSize: 14, fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>{t("buyers.invCta")}</a>
      </div>

      <div style={{ background: "var(--surface)", borderRadius: 20, padding: "40px 32px", marginTop: 48, textAlign: "center", border: "1px solid var(--line)" }}>
        <h2 style={{ fontSize: "clamp(24px,3vw,32px)", margin: "0 0 12px" }}>{t("buyers.ctaTitle")}</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, margin: "0 0 24px" }}>{t("buyers.ctaText")}</p>
        <a href={AGENT.calendly} style={{ background: "var(--coral)", color: "#fff", padding: "14px 30px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>{t("common.bookConsult")}</a>
      </div>
    </div>
  );
}
