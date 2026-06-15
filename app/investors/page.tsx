"use client";
import Link from "next/link";
import { LISTINGS, AGENT, fmtPrice } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import BookButton from "@/components/BookButton";

export default function Investors() {
  const { t } = useLang();
  const deals = LISTINGS.filter(l => l.investor);
  const services: [string, string][] = [
    [t("inv.s1t"), t("inv.s1d")],
    [t("inv.s2t"), t("inv.s2d")],
    [t("inv.s3t"), t("inv.s3d")],
  ];
  return (
    <div>
      <section style={{ position: "relative", minHeight: "72vh", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1736829391323-a302d2737210?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(22,18,28,.6) 0%,rgba(22,18,28,.4) 40%,rgba(22,18,28,.96) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "0 24px 64px", width: "100%" }}>
          <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 16 }}>{t("inv.eyebrow")}</div>
          <h1 style={{ fontSize: "clamp(36px,6vw,68px)", lineHeight: 1.04, margin: 0, maxWidth: 760, color: "#fff" }}>{t("inv.title")}</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.9)", maxWidth: 540, marginTop: 20, lineHeight: 1.7 }}>{t("inv.sub")}</p>
          <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
            <a href="#calculator" style={{ background: "var(--coral)", color: "#fff", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>{t("inv.analyze")}</a>
            <a href="#deals" style={{ background: "rgba(246,241,236,.1)", color: "var(--text)", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none", border: "1px solid var(--line)" }}>{t("inv.seeProps")}</a>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0" }}>
        <h2 style={{ fontSize: "clamp(26px,4vw,40px)", margin: "0 0 8px", maxWidth: 640 }}>{t("inv.svcTitle")}</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 560, marginTop: 0 }}>{t("inv.svcSub")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 32 }}>
          {services.map(([title, d], i) => (
            <div key={i} style={{ background: "var(--surface)", borderRadius: 16, padding: 26, border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 13, color: "var(--coral)", fontWeight: 500, marginBottom: 12 }}>0{i + 1}</div>
              <div style={{ fontSize: 19, fontFamily: "Space Grotesk, sans-serif", fontWeight: 500, marginBottom: 10 }}>{title}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>
      <section id="calculator" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0", scrollMarginTop: 90 }}>
        <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 10 }}>{t("inv.calcEyebrow")}</div>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", margin: "0 0 8px" }}>{t("inv.calcTitle")}</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 0, marginBottom: 28, maxWidth: 540 }}>{t("inv.calcSub")}</p>
        <InvestmentCalculator />
      </section>
      <section id="deals" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0", scrollMarginTop: 90 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 8 }}>{t("inv.dealsEyebrow")}</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,38px)", margin: 0 }}>{t("inv.dealsTitle")}</h2>
          </div>
          <Link href="/search" style={{ color: "var(--text)", fontSize: 14, textDecoration: "none", opacity: 0.8 }}>{t("common.allListings")}</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {deals.map(l => (
            <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: "none", background: "var(--surface)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)", display: "block" }}>
              <div style={{ height: 170, backgroundImage: `url(${l.photos[0]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 20, fontWeight: 500, fontFamily: "Space Grotesk, sans-serif", color: "var(--text)" }}>{fmtPrice(l.price)}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{l.address}, {l.city}</div>
                <div style={{ background: "var(--bg)", borderRadius: 10, padding: "10px 8px", textAlign: "center", marginTop: 14 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{t("inv.estRent")}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "var(--green)" }}>${l.estRent?.toLocaleString()}/mo</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ background: "var(--surface)", borderRadius: 20, padding: "44px 32px", textAlign: "center", border: "1px solid var(--line)" }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", margin: "0 0 12px" }}>{t("inv.ctaTitle")}</h2>
          <p style={{ color: "var(--muted)", fontSize: 16, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>{t("inv.ctaText")}</p>
          <BookButton intent="invest" source="Investors page CTA" label={t("inv.ctaBtn")} />
        </div>
      </section>
    </div>
  );
}
