"use client";
import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES, LISTINGS, AGENT, fmtPrice } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import BookButton from "@/components/BookButton";

export default function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { lang } = useLang();
  const city = CITIES.find(c => c.slug === slug);
  if (!city) return notFound();
  const listings = LISTINGS.filter(l => city.matchCities.includes(l.city));

  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "56vh", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${city.photo})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(22,18,28,.5) 0%,rgba(22,18,28,.4) 40%,rgba(22,18,28,.96) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px", width: "100%" }}>
          <Link href="/city" style={{ color: "var(--muted)", fontSize: 14, textDecoration: "none" }}>← {lang === "ru" ? "Все города" : "All cities"}</Link>
          <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", margin: "14px 0 10px" }}>{city.tagline[lang]}</div>
          <h1 style={{ fontSize: "clamp(36px,6vw,64px)", lineHeight: 1.04, margin: 0 }}>{city.name}</h1>
          <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 560, marginTop: 16, lineHeight: 1.7 }}>{city.blurb[lang]}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <Link href={`/search?city=${encodeURIComponent(city.name)}`} style={{ background: "var(--coral)", color: "#fff", padding: "13px 26px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>{lang === "ru" ? `Искать в ${city.name}` : `Search in ${city.name}`}</Link>
            <BookButton intent="buy" source="City page hero" label={lang === "ru" ? "Записаться" : "Book a consultation"} variant="outline" style={{ background: "rgba(246,241,236,.1)", padding: "13px 26px" }} />
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", margin: 0 }}>{lang === "ru" ? `Объекты в ${city.name}` : `Homes in ${city.name}`}</h2>
          <Link href="/search" style={{ color: "var(--text)", fontSize: 14, textDecoration: "none", opacity: 0.8 }}>{lang === "ru" ? "Все объекты →" : "All listings →"}</Link>
        </div>
        {listings.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
            {listings.map(l => (
              <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: "none", background: "var(--surface)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)", display: "block" }}>
                <div style={{ height: 180, backgroundImage: `url(${l.photos[0]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 20, fontWeight: 500, fontFamily: "Space Grotesk, sans-serif", color: "var(--text)" }}>{fmtPrice(l.price)}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{l.address}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{l.beds} bd · {l.baths} ba · {l.sqft.toLocaleString()} sqft</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ background: "var(--surface)", borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid var(--line)", color: "var(--muted)" }}>
            {lang === "ru" ? "Скоро здесь появятся объекты. Напишите — подберём под запрос." : "Listings coming soon. Reach out and we'll match you to what fits."}
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 0" }}>
        <div style={{ background: "var(--surface)", borderRadius: 20, padding: "40px 32px", textAlign: "center", border: "1px solid var(--line)" }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,30px)", margin: "0 0 12px" }}>{lang === "ru" ? `Интересует ${city.name}?` : `Interested in ${city.name}?`}</h2>
          <p style={{ color: "var(--muted)", fontSize: 16, margin: "0 0 24px" }}>{lang === "ru" ? `Запишитесь к ${AGENT.name} — обсудим район и варианты.` : `Book time with ${AGENT.name} to talk neighborhoods and options.`}</p>
          <BookButton intent="buy" source="City page CTA" label={lang === "ru" ? "Записаться" : "Book a consultation"} />
        </div>
      </section>
    </div>
  );
}
