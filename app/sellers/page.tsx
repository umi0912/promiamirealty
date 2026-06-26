"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import HomeValuation from "@/components/HomeValuation";
import BookButton from "@/components/BookButton";
import FAQ from "@/components/FAQ";

export default function Sellers() {
  const { t, lang } = useLang();
  const tt = (en: string, ru: string) => (lang === "ru" ? ru : en);
  const [stats, setStats] = useState<{ active: number; medianPrice: number; medianPpsf: number } | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch("/api/market-stats");
        const data = await res.json();
        if (!cancel) setStats(data.stats);
      } catch { /* скрываем */ }
    })();
    return () => { cancel = true; };
  }, []);

  const faqs = [
    { q: tt("What's your commission?", "Какая комиссия?"), a: tt("Commission is negotiable and depends on the property and scope. Ays will explain exactly what's included before you list — no surprises.", "Комиссия обсуждается и зависит от объекта и объёма работ. Ays объяснит, что входит, ещё до листинга — без сюрпризов.") },
    { q: tt("How should I prepare my home?", "Как подготовить дом?"), a: tt("Declutter, handle small repairs, and let us arrange professional photos and staging guidance. Small prep often returns far more at sale.", "Убрать лишнее, мелкий ремонт, а мы организуем профессиональные фото и советы по стейджингу. Небольшая подготовка часто окупается при продаже.") },
    { q: tt("When is the best time to sell?", "Когда лучше продавать?"), a: tt("South Florida sells year-round, with strong demand in winter/spring from relocating and international buyers. We'll time it to your goals.", "Южная Флорида продаётся круглый год, пик спроса зимой/весной от переезжающих и иностранных покупателей. Подберём момент под ваши цели.") },
    { q: tt("How do you price my home?", "Как вы определяете цену?"), a: tt("With real comparable sales and current demand — not guesswork — so it's priced to attract offers without leaving money on the table.", "По реальным сделкам-аналогам и текущему спросу — не на глаз — чтобы цена привлекала офферы и не теряла вашу выгоду.") },
    { q: tt("Where will my listing be seen?", "Где увидят мой листинг?"), a: tt("On the MLS and syndicated to Zillow, Realtor.com, Redfin and more — plus targeted reach to the right buyers.", "В MLS и на Zillow, Realtor.com, Redfin и др. — плюс таргетинг на нужных покупателей.") },
  ];

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
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(44,90,80,.45) 0%,rgba(22,18,28,.4) 40%,rgba(22,18,28,.96) 100%)" }} />
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

      {/* MARKET ACTIVITY */}
      {stats && stats.active > 0 && (
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "0 0 4px" }}>{tt("Recent market activity", "Активность рынка")}</h2>
          <p style={{ color: "var(--muted)", fontSize: 15, margin: "0 0 22px" }}>{tt("Live data across Miami-Dade & Broward — so you price with the market, not against it.", "Живые данные по Miami-Dade и Broward — чтобы цена соответствовала рынку.")}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="mstats">
            {[
              [stats.active.toLocaleString(), tt("Active homes for sale", "Активных объектов в продаже")],
              ["$" + stats.medianPrice.toLocaleString(), tt("Median list price", "Медианная цена листинга")],
              ["$" + stats.medianPpsf.toLocaleString(), tt("Median price / sqft", "Медиана за sqft")],
            ].map(([v, lab], i) => (
              <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: "26px 24px" }}>
                <div style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: "var(--indigo)", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 14, color: "var(--text)", marginTop: 8, fontWeight: 600 }}>{lab}</div>
              </div>
            ))}
          </div>
        </div>
      )}

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
      {/* FAQ */}
      <div style={{ marginTop: 72 }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "0 0 20px" }}>{tt("Seller FAQ", "Частые вопросы продавцов")}</h2>
        <FAQ items={faqs} />
      </div>

      <div style={{ background: "var(--indigo)", borderRadius: 20, padding: "48px 32px", marginTop: 72, textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px,3vw,32px)", margin: "0 0 12px", color: "#fff" }}>{t("sellers.ctaTitle")}</h2>
        <p style={{ color: "rgba(255,255,255,.75)", fontSize: 16, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>{t("sellers.ctaText")}</p>
        <BookButton intent="sell" source="Sellers page CTA" label={t("common.bookConsult")} />
      </div>
      </div>
      <style>{`@media(max-width:760px){ .mstats{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}
