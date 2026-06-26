"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { NEIGHBORHOODS } from "@/lib/data";
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

  const reviews = [
    { text: tt("Ays priced our home right and we had multiple offers in the first week — sold above asking.", "Ays выставила правильную цену, и в первую неделю было несколько офферов — продали выше запрашиваемой."), who: tt("Seller · Pinecrest", "Продавец · Pinecrest") },
    { text: tt("Professional photos and staging advice made a real difference. Smooth from listing to closing.", "Профессиональные фото и советы по стейджингу реально помогли. Гладко от листинга до сделки."), who: tt("Seller · Aventura", "Продавец · Aventura") },
    { text: tt("She handled everything and kept us informed. Honest, sharp, and easy to work with.", "Она всё взяла на себя и держала в курсе. Честная, профессиональная, с ней легко."), who: tt("Seller · Fort Lauderdale", "Продавец · Fort Lauderdale") },
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }} className="mstats">
            {[
              [stats.active.toLocaleString(), tt("Active homes for sale", "Активных объектов в продаже")],
              ["$" + stats.medianPrice.toLocaleString(), tt("Median list price", "Медианная цена листинга")],
              ["$" + stats.medianPpsf.toLocaleString() + "/sqft", tt("Median price per sqft", "Медиана за sqft")],
            ].map(([v, lab], i) => (
              <div key={i} style={{ padding: "32px 20px", textAlign: "center", borderLeft: i ? "1px solid var(--line)" : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} className="mstat-cell">
                <div style={{ fontSize: "clamp(26px,3.4vw,38px)", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: "var(--indigo)", lineHeight: 1, letterSpacing: "-0.02em" }}>{v}</div>
                <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{lab}</div>
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
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <HomeValuation />
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
      {/* NEIGHBORHOODS */}
      <div style={{ marginTop: 72 }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "0 0 4px" }}>{tt("Selling in your area?", "Продаёте в этих районах?")}</h2>
        <p style={{ color: "var(--muted)", fontSize: 15, margin: "0 0 22px" }}>{tt("See what's active near you to gauge demand and pricing.", "Посмотрите активные объекты рядом — оцените спрос и цены.")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="shoods">
          {NEIGHBORHOODS.map(n => (
            <Link key={n.name} href={`/search?city=${encodeURIComponent(n.name)}`} className="hoodcard" style={{ textDecoration: "none", position: "relative", borderRadius: 14, overflow: "hidden", minHeight: 150, display: "flex", alignItems: "flex-end", padding: 18 }}>
              <div className="hoodcard-img" style={{ position: "absolute", inset: 0, backgroundImage: `url("${n.img}")`, backgroundSize: "cover", backgroundPosition: "center", transition: "transform .5s cubic-bezier(.2,.7,.2,1)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.05) 30%,rgba(44,90,80,.88) 100%)" }} />
              <span style={{ position: "relative", color: "#fff", fontSize: 20, fontWeight: 600, fontFamily: "Space Grotesk, sans-serif" }}>{n.name} <span style={{ opacity: .8 }}>→</span></span>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 72 }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "0 0 20px" }}>{tt("Seller FAQ", "Частые вопросы продавцов")}</h2>
        <FAQ items={faqs} />
      </div>

      {/* TESTIMONIALS */}
      <div style={{ marginTop: 72 }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "0 0 20px" }}>{tt("What sellers say", "Отзывы продавцов")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="sreviews">
          {reviews.map((r, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: 24 }}>
              <div style={{ color: "var(--amber)", fontSize: 18, marginBottom: 10 }}>★★★★★</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text)", margin: "0 0 14px" }}>&ldquo;{r.text}&rdquo;</p>
              <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{r.who}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--indigo)", borderRadius: 20, padding: "48px 32px", marginTop: 72, textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px,3vw,32px)", margin: "0 0 12px", color: "#fff" }}>{t("sellers.ctaTitle")}</h2>
        <p style={{ color: "rgba(255,255,255,.75)", fontSize: 16, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>{t("sellers.ctaText")}</p>
        <BookButton intent="sell" source="Sellers page CTA" label={t("common.bookConsult")} />
      </div>
      </div>
      <style>{`
        .hoodcard:hover .hoodcard-img{ transform: scale(1.07); }
        @media(max-width:900px){ .shoods,.sreviews{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:760px){ .mstats{ grid-template-columns:1fr !important; } .mstat-cell{ border-left:none !important; } .mstat-cell:not(:first-child){ border-top:1px solid var(--line); } }
        @media(max-width:560px){ .shoods,.sreviews{ grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}
