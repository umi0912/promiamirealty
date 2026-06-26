"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { type Listing, fmtPrice } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import BookButton from "@/components/BookButton";
import Reveal from "@/components/Reveal";

export default function Investors() {
  const { t } = useLang();
  const [deals, setDeals] = useState<Listing[]>([]);
  const [rents, setRents] = useState<Record<string, number | null>>({});

  // живые MLS-листинги в инвест-диапазоне
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch("/api/listings?status=active&minPrice=300000&maxPrice=800000");
        const data = await res.json();
        if (!cancel) setDeals((data.listings || []).slice(0, 6));
      } catch { /* пропускаем */ }
    })();
    return () => { cancel = true; };
  }, []);

  // реальная оценка аренды по lease-компам (город + спальни)
  useEffect(() => {
    let cancel = false;
    deals.forEach(async l => {
      if (rents[l.id] !== undefined || !l.beds) return;
      try {
        const r = await fetch(`/api/rent-estimate?city=${encodeURIComponent(l.city)}&beds=${l.beds}`);
        const d = await r.json();
        if (!cancel) setRents(prev => ({ ...prev, [l.id]: d.rent }));
      } catch { /* пропускаем */ }
    });
    return () => { cancel = true; };
  }, [deals]); // eslint-disable-line react-hooks/exhaustive-deps
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
            <a href="#deals" style={{ background: "rgba(255,255,255,0.16)", color: "#fff", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.5)" }}>{t("inv.seeProps")}</a>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0" }}>
        <h2 style={{ fontSize: "clamp(26px,4vw,40px)", margin: "0 0 8px", maxWidth: 640 }}>{t("inv.svcTitle")}</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 560, marginTop: 0 }}>{t("inv.svcSub")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 32 }}>
          {services.map(([title, d], i) => (
            <Reveal key={i} delay={i * 70} style={{ background: "var(--surface)", borderRadius: 16, padding: 26, border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 13, color: "var(--coral)", fontWeight: 500, marginBottom: 12 }}>0{i + 1}</div>
              <div style={{ fontSize: 19, fontFamily: "Space Grotesk, sans-serif", fontWeight: 500, marginBottom: 10 }}>{title}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{d}</div>
            </Reveal>
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
              <div style={{ height: 170, backgroundImage: `url("${l.photos[0]}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 20, fontWeight: 500, fontFamily: "Space Grotesk, sans-serif", color: "var(--text)" }}>{fmtPrice(l.price)}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{l.beds ? `${l.beds} bd · ` : ""}{l.baths ? `${l.baths} ba · ` : ""}{l.sqft ? `${l.sqft.toLocaleString()} sqft` : ""}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{l.address}, {l.city}</div>
                <div style={{ background: "var(--bg)", borderRadius: 10, padding: "10px 8px", textAlign: "center", marginTop: 14 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{t("inv.estRent")}{rents[l.id] != null ? ` · ${t("inv.rentComps")}` : ""}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "var(--green)" }}>${(rents[l.id] != null ? rents[l.id]! : Math.round(l.price * 0.006)).toLocaleString()}/mo</div>
                </div>
              </div>
            </Link>
          ))}
          {deals.length === 0 && <div style={{ gridColumn: "1/-1", color: "var(--muted)", fontSize: 14 }}>Loading investment options…</div>}
        </div>
      </section>
      <section style={{ background: "var(--indigo)", padding: "56px 24px 64px", marginTop: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", margin: "0 0 12px", color: "#fff" }}>{t("inv.ctaTitle")}</h2>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: 16, margin: "0 0 28px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>{t("inv.ctaText")}</p>
          <BookButton intent="invest" source="Investors page CTA" label={t("inv.ctaBtn")} variant="light" />
        </div>
      </section>
    </div>
  );
}
