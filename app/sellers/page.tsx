"use client";
import { AGENT } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import HomeValuation from "@/components/HomeValuation";

export default function Sellers() {
  const { t } = useLang();
  const steps: [string, string][] = [
    [t("sellers.s1t"), t("sellers.s1d")],
    [t("sellers.s2t"), t("sellers.s2d")],
    [t("sellers.s3t"), t("sellers.s3d")],
    [t("sellers.s4t"), t("sellers.s4d")],
  ];
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>{t("sellers.eyebrow")}</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 16px", lineHeight: 1.05, maxWidth: 720 }}>{t("sellers.title")}</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted)", maxWidth: 600 }}>{t("sellers.sub")}</p>

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
        <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 10 }}>{t("sellers.freeTool")}</div>
        <h2 style={{ fontSize: "clamp(26px,3.5vw,34px)", marginBottom: 8 }}>{t("sellers.valTitle")}</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 0, marginBottom: 24, maxWidth: 520 }}>{t("sellers.valSub")}</p>
        <HomeValuation />
      </div>

      <div style={{ background: "var(--surface)", borderRadius: 20, padding: "40px 32px", marginTop: 48, textAlign: "center", border: "1px solid var(--line)" }}>
        <h2 style={{ fontSize: "clamp(24px,3vw,32px)", margin: "0 0 12px" }}>{t("sellers.ctaTitle")}</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>{t("sellers.ctaText")}</p>
        <a href={AGENT.calendly} style={{ background: "var(--coral)", color: "#fff", padding: "14px 30px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>{t("common.bookConsult")}</a>
      </div>
    </div>
  );
}
