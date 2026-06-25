"use client";
import { useLang } from "@/lib/i18n";
import HomeValuation from "@/components/HomeValuation";
import BookButton from "@/components/BookButton";

export default function Sellers() {
  const { t } = useLang();
  const steps: [string, string][] = [
    [t("sellers.s1t"), t("sellers.s1d")],
    [t("sellers.s2t"), t("sellers.s2d")],
    [t("sellers.s3t"), t("sellers.s3d")],
    [t("sellers.s4t"), t("sellers.s4d")],
  ];
  return (
    <div>
      <section style={{ position: "relative", minHeight: "62vh", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1728324580682-d7e19f767f14?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(46,26,74,.45) 0%,rgba(22,18,28,.4) 40%,rgba(22,18,28,.96) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "0 24px 56px", width: "100%" }}>
          <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 14 }}>{t("sellers.eyebrow")}</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 16px", lineHeight: 1.05, maxWidth: 720, color: "#fff" }}>{t("sellers.title")}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,.9)", maxWidth: 600 }}>{t("sellers.sub")}</p>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 48 }}>
        {steps.map(([title, d], i) => (
          <div key={i} style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
            <div style={{ fontSize: 13, color: "var(--coral)", fontWeight: 500, marginBottom: 10 }}>{t("step")} {i + 1}</div>
            <div style={{ fontSize: 17, fontFamily: "Space Grotesk, sans-serif", fontWeight: 500, marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{d}</div>
          </div>
        ))}
      </div>

      </div>

      <section style={{ background: "var(--indigo)", padding: "80px 24px 88px", marginTop: 80 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,34px)", marginBottom: 12, color: "#fff" }}>{t("sellers.valTitle")}</h2>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 16, marginTop: 0, marginBottom: 36, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>{t("sellers.valSub")}</p>
        </div>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <HomeValuation />
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ background: "var(--indigo)", borderRadius: 20, padding: "48px 32px", marginTop: 72, textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px,3vw,32px)", margin: "0 0 12px", color: "#fff" }}>{t("sellers.ctaTitle")}</h2>
        <p style={{ color: "rgba(255,255,255,.75)", fontSize: 16, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>{t("sellers.ctaText")}</p>
        <BookButton intent="sell" source="Sellers page CTA" label={t("common.bookConsult")} />
      </div>
      </div>
    </div>
  );
}
