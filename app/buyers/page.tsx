"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { type Listing, fmtPrice } from "@/lib/data";
import MortgageCalculator from "@/components/MortgageCalculator";
import BookButton from "@/components/BookButton";
import FAQ from "@/components/FAQ";

const NEIGHBORHOODS = ["Miami Beach", "Coral Gables", "Aventura", "Fort Lauderdale", "Hollywood", "Coral Springs"];

export default function Buyers() {
  const { t, lang } = useLang();
  const tt = (en: string, ru: string) => (lang === "ru" ? ru : en);
  const [homes, setHomes] = useState<Listing[]>([]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch("/api/listings?status=active&minPrice=400000&maxPrice=900000");
        const data = await res.json();
        if (!cancel) setHomes((data.listings || []).slice(0, 4));
      } catch { /* скрываем секцию */ }
    })();
    return () => { cancel = true; };
  }, []);

  const faqs = [
    { q: tt("How much do I need for a down payment?", "Сколько нужно на первый взнос?"), a: tt("Often 3–20% depending on the loan. FHA can be as low as 3.5%, conventional 5–20%. We'll connect you with lenders to find the best fit.", "Обычно 3–20% в зависимости от кредита. FHA — от 3.5%, conventional — 5–20%. Подключим кредиторов и подберём лучший вариант.") },
    { q: tt("What are closing costs?", "Какие closing costs?"), a: tt("Typically 2–5% of the price (lender fees, title, taxes, insurance). You'll get a clear estimate up front.", "Обычно 2–5% от цены (комиссии кредитора, title, налоги, страховка). Дадим понятную смету заранее.") },
    { q: tt("How long does buying take?", "Сколько занимает покупка?"), a: tt("From accepted offer to closing usually 30–45 days with financing, faster with cash.", "От принятого оффера до сделки обычно 30–45 дней с ипотекой, быстрее за наличные.") },
    { q: tt("Do I need preapproval first?", "Нужно ли предодобрение?"), a: tt("Yes — it shows sellers you're serious and tells you your real budget. It's free and quick.", "Да — это показывает продавцам серьёзность и определяет ваш реальный бюджет. Это быстро и бесплатно.") },
    { q: tt("Can you help with relocation or international buyers?", "Помогаете при переезде / иностранным покупателям?"), a: tt("Absolutely. Ays works with relocating and international buyers (EN/RU/ES) and guides remote purchases.", "Конечно. Ays работает с переезжающими и иностранными покупателями (EN/RU/ES) и ведёт удалённые сделки.") },
  ];

  const reviews = [
    { text: tt("Ays found us a home under budget in a tough market. Her negotiation saved us real money.", "Ays нашла нам дом ниже бюджета на сложном рынке. Её переговоры сэкономили реальные деньги."), who: tt("Buyer · Coral Gables", "Покупатель · Coral Gables") },
    { text: tt("First-time buyers and nervous — she explained every step and never pushed. Smooth closing.", "Первая покупка, мы волновались — она объяснила каждый шаг и не давила. Сделка прошла гладко."), who: tt("Buyer · Miami", "Покупатель · Miami") },
    { text: tt("As an investor I needed sharp numbers, not a sales pitch. Ays delivered both.", "Как инвестору мне нужны были точные цифры, а не уговоры. Ays дала и то, и другое."), who: tt("Investor · Fort Lauderdale", "Инвестор · Fort Lauderdale") },
  ];

  const steps: [string, string][] = [
    [t("buyers.s1t"), t("buyers.s1d")],
    [t("buyers.s2t"), t("buyers.s2d")],
    [t("buyers.s3t"), t("buyers.s3d")],
    [t("buyers.s4t"), t("buyers.s4d")],
  ];
  return (
    <div>
      <section style={{ position: "relative", minHeight: "62vh", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1670811456186-e73d0ace9454?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(44,90,80,.45) 0%,rgba(22,18,28,.4) 40%,rgba(22,18,28,.96) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "0 24px 56px", width: "100%" }}>
          <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 14 }}>{t("buyers.eyebrow")}</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 16px", lineHeight: 1.05, maxWidth: 720, color: "#fff" }}>{t("buyers.title")}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,.9)", maxWidth: 600 }}>{t("buyers.sub")}</p>
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

      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontSize: "clamp(26px,3.5vw,34px)", marginBottom: 8 }}>{t("buyers.calcTitle")}</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 0, marginBottom: 24, maxWidth: 520 }}>{t("buyers.calcSub")}</p>
        <MortgageCalculator price={650000} editablePrice />
      </div>

      <div style={{ marginTop: 32, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 15, color: "var(--muted)" }}>{t("buyers.invLink")}</div>
        <a href="/investors" style={{ color: "var(--coral)", fontSize: 14, fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>{t("buyers.invCta")}</a>
      </div>

      {/* HOMES YOU MIGHT LIKE */}
      {homes.length > 0 && (
        <div style={{ marginTop: 72 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: 0 }}>{tt("Homes you might like", "Объекты для вас")}</h2>
            <Link href="/search" style={{ color: "var(--coral)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{tt("See all →", "Все объекты →")}</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="bhomes">
            {homes.map(l => (
              <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden", background: "var(--surface-2)" }}>
                  <div style={{ width: "100%", height: "100%", backgroundImage: `url("${l.photos[0]}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", marginTop: 8 }}>{fmtPrice(l.price)}</div>
                <div style={{ fontSize: 13, color: "var(--text)", marginTop: 2 }}>{l.beds ? `${l.beds} bd · ` : ""}{l.baths ? `${l.baths} ba · ` : ""}{l.sqft ? `${l.sqft.toLocaleString()} sqft` : ""}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{l.address}, {l.city}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* NEIGHBORHOODS */}
      <div style={{ marginTop: 72 }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "0 0 20px" }}>{tt("Explore by neighborhood", "Районы")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="bhoods">
          {NEIGHBORHOODS.map(city => (
            <Link key={city} href={`/search?city=${encodeURIComponent(city)}`} style={{ textDecoration: "none", position: "relative", borderRadius: 14, overflow: "hidden", minHeight: 130, display: "flex", alignItems: "flex-end", padding: 18, background: "linear-gradient(135deg, var(--indigo), var(--violet))" }}>
              <span style={{ color: "#fff", fontSize: 19, fontWeight: 600, fontFamily: "Space Grotesk, sans-serif" }}>{city} <span style={{ opacity: .7 }}>→</span></span>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 72 }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "0 0 20px" }}>{tt("Buyer FAQ", "Частые вопросы покупателей")}</h2>
        <FAQ items={faqs} />
      </div>

      {/* TESTIMONIALS */}
      <div style={{ marginTop: 72 }}>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "0 0 20px" }}>{tt("What clients say", "Отзывы клиентов")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="breviews">
          {reviews.map((r, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: 24 }}>
              <div style={{ color: "var(--amber)", fontSize: 18, marginBottom: 10 }}>★★★★★</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text)", margin: "0 0 14px" }}>&ldquo;{r.text}&rdquo;</p>
              <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{r.who}</div>
            </div>
          ))}
        </div>
      </div>

      </div>

      <section style={{ background: "var(--indigo)", padding: "56px 24px 64px", marginTop: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,32px)", margin: "0 0 12px", color: "#fff" }}>{t("buyers.ctaTitle")}</h2>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: 16, margin: "0 0 28px" }}>{t("buyers.ctaText")}</p>
          <BookButton intent="buy" source="Buyers page CTA" label={t("common.bookConsult")} />
        </div>
      </section>
      <style>{`
        @media(max-width:900px){ .bhomes{ grid-template-columns:repeat(2,1fr) !important; } .bhoods,.breviews{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:560px){ .bhomes,.bhoods,.breviews{ grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}
