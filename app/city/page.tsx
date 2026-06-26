"use client";
import Link from "next/link";
import { CITIES, LISTINGS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export default function CitiesIndex() {
  const { lang } = useLang();
  const count = (matchCities: string[]) => LISTINGS.filter(l => matchCities.includes(l.city)).length;
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 14 }}>{lang === "ru" ? "Локации" : "Locations"}</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "0 0 16px", lineHeight: 1.05 }}>{lang === "ru" ? "Где мы работаем" : "Where we work"}</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--muted)", maxWidth: 560 }}>{lang === "ru" ? "От Майами до Boca Raton — выберите район и смотрите объекты по локации." : "From Miami to Boca Raton — pick an area and explore listings by location."}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18, marginTop: 40 }}>
        {CITIES.map(c => (
          <Link key={c.slug} href={`/city/${c.slug}`} style={{ textDecoration: "none", position: "relative", borderRadius: 18, overflow: "hidden", minHeight: 220, display: "block" }} className="citycard">
            <div className="citycard-img" style={{ position: "absolute", inset: 0, backgroundImage: `url("${c.photo}")`, backgroundSize: "cover", backgroundPosition: "center", transition: "transform .5s cubic-bezier(.2,.7,.2,1)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(22,18,28,.15) 40%,rgba(255,255,255,.92) 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20 }}>
              <div style={{ fontSize: 22, fontFamily: "Space Grotesk, sans-serif", fontWeight: 500, color: "#fff" }}>{c.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginTop: 4 }}>{c.tagline[lang]}</div>
              <div style={{ fontSize: 12, color: "var(--amber)", marginTop: 8 }}>{count(c.matchCities)} {lang === "ru" ? "объектов" : "listings"}</div>
            </div>
          </Link>
        ))}
      </div>
      <style>{`.citycard:hover .citycard-img{ transform: scale(1.06); }`}</style>
    </div>
  );
}
