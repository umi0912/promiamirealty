"use client";
import Link from "next/link";
import { AGENT } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export default function About() {
  const { t } = useLang();
  const values: [string, string][] = [
    [t("about.v1t"), t("about.v1d")],
    [t("about.v2t"), t("about.v2d")],
    [t("about.v3t"), t("about.v3d")],
    [t("about.v4t"), t("about.v4d")],
  ];
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="agrid">
        <div>
          <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>{t("about.eyebrow")}</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 20px", lineHeight: 1.05 }}>{AGENT.name}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted)" }}>{t("about.p1")}</p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--muted)" }}>{t("about.p2")}</p>
          <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
            <a href={AGENT.calendly} style={{ background: "var(--coral)", color: "#fff", padding: "13px 26px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>{t("common.bookConsult")}</a>
            <Link href="/contact" style={{ background: "rgba(246,241,236,.08)", color: "var(--text)", padding: "13px 26px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none", border: "1px solid var(--line)" }}>{t("common.getInTouch")}</Link>
          </div>
        </div>
        <div style={{ aspectRatio: "4/5", borderRadius: 20, background: "var(--surface-2)", backgroundImage: "url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginTop: 72 }}>
        {values.map(([title, d], i) => (
          <div key={i} style={{ background: "var(--surface)", borderRadius: 16, padding: 24, border: "1px solid var(--line)" }}>
            <div style={{ fontSize: 18, fontFamily: "Fraunces, serif", fontWeight: 500, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{d}</div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:820px){ .agrid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}
