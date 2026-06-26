"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { type Listing, LISTINGS, AGENT, fmtPrice } from "@/lib/data";
import MortgageCalculator from "@/components/MortgageCalculator";
import BookButton from "@/components/BookButton";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div style={{ height: 320, borderRadius: 16, background: "var(--surface-2)" }} />,
});

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [l, setL] = useState<Listing | null>(() => LISTINGS.find(x => x.id === id) || null);
  const [loading, setLoading] = useState(!l);
  const [active, setActive] = useState(0);
  const [similar, setSimilar] = useState<Listing[]>([]);

  // если нет в статике — тянем live из Spark
  useEffect(() => {
    if (l) return;
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        const data = await res.json();
        if (!cancel) setL(data.listing || null);
      } catch { if (!cancel) setL(null); }
      if (!cancel) setLoading(false);
    })();
    return () => { cancel = true; };
  }, [id, l]);

  // похожие листинги (тот же город)
  useEffect(() => {
    if (!l?.city) return;
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(`/api/listings?q=${encodeURIComponent(l.city)}&status=active`);
        const data = await res.json();
        if (!cancel) setSimilar((data.listings || []).filter((x: Listing) => x.id !== l.id).slice(0, 4));
      } catch { /* пропускаем */ }
    })();
    return () => { cancel = true; };
  }, [l?.city, l?.id]);

  if (loading) return <div style={{ paddingTop: 140, textAlign: "center", color: "var(--muted)" }}>Loading listing…</div>;
  if (!l) return <div style={{ paddingTop: 140, textAlign: "center", color: "var(--muted)" }}>Listing not found. <Link href="/search" style={{ color: "var(--indigo)" }}>Back to search</Link></div>;

  // быстрая оценка платежа: 20% down, 7% 30yr + налог/12 + HOA
  const loan = l.price * 0.8, mr = 0.07 / 12, np = 360;
  const pi = (loan * mr * Math.pow(1 + mr, np)) / (Math.pow(1 + mr, np) - 1);
  const estPay = Math.round(pi + (l.taxAnnual ? l.taxAnnual / 12 : (l.price * 0.011) / 12) + (l.hoaMonthly || 0));
  const pricePerSqft = l.sqft ? Math.round(l.price / l.sqft) : 0;

  const cards: [string, string][] = [
    ["Price per sqft", pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "—"],
    ["Built in", l.yearBuilt ? String(l.yearBuilt) : "—"],
    ["Property size", l.sqft ? `${l.sqft.toLocaleString()} sqft` : "—"],
    ["Property type", l.type],
  ];
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "112px 24px 0" }}>
      <Link href="/search" style={{ color: "var(--muted)", fontSize: 14, textDecoration: "none" }}>← Back to search</Link>

      {/* GALLERY */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, height: 380, marginTop: 16 }} className="gal">
        <div style={{ backgroundImage: `url("${l.photos[active]}")`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 12 }} />
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 10 }}>
          {l.photos.slice(1, 3).map((p, i) => (
            <div key={i} onClick={() => setActive(i + 1)} style={{ backgroundImage: `url("${p}")`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 12, cursor: "pointer" }} />
          ))}
        </div>
      </div>
      {l.photos.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {l.photos.map((p, i) => (
            <div key={i} onClick={() => setActive(i)} style={{ width: 64, height: 48, borderRadius: 8, backgroundImage: `url("${p}")`, backgroundSize: "cover", backgroundPosition: "center", cursor: "pointer", border: active === i ? "2px solid var(--coral)" : "2px solid transparent" }} />
          ))}
        </div>
      )}

      {/* SUMMARY + AGENT CARD рядом */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40, marginTop: 28, alignItems: "start" }} className="dgrid">
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <span style={{ background: "rgba(44,90,80,.18)", color: "var(--coral)", fontSize: 12, fontWeight: 500, padding: "4px 11px", borderRadius: 999 }}>{l.status}</span>
            <span style={{ background: "var(--surface-2)", color: "var(--muted)", fontSize: 12, padding: "4px 11px", borderRadius: 999 }}>{l.type}</span>
          </div>
          {/* beds · baths · sqft summary */}
          <div style={{ display: "flex", gap: 18, marginBottom: 14, fontSize: 15, color: "var(--text)", fontWeight: 500 }}>
            <span>🛏 {l.beds || "Studio"} {l.beds ? "Beds" : ""}</span>
            <span>🛁 {l.baths} Baths</span>
            {l.sqft ? <span>📐 {l.sqft.toLocaleString()} sqft</span> : null}
          </div>
          <div style={{ fontSize: "clamp(32px,5vw,44px)", fontFamily: "Space Grotesk, sans-serif", fontWeight: 500, lineHeight: 1 }}>{fmtPrice(l.price)}</div>
          <div style={{ fontSize: 16, color: "var(--muted)", marginTop: 8 }}>{l.address}, {l.city}, {l.state} {l.zip}</div>
          {/* est payment pill */}
          <div style={{ display: "inline-block", marginTop: 14, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, padding: "8px 16px", fontSize: 14, color: "var(--text)" }}>
            Est. payment: <strong>${estPay.toLocaleString()}/mo</strong>
          </div>

          {/* 4 cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 24 }}>
            {cards.map(([lab, v], i) => (
              <div key={i} style={{ background: "var(--surface)", borderRadius: 12, padding: "16px 12px", textAlign: "center", border: "1px solid var(--line)" }}>
                <div style={{ fontSize: 19, fontWeight: 500, fontFamily: "Space Grotesk, sans-serif" }}>{v}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{lab}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AGENT CARD — рядом с данными */}
        <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 20, position: "sticky", top: 100 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <AgentAvatar />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{AGENT.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{AGENT.brokerage} · {AGENT.license}</div>
            </div>
          </div>
          <BookButton intent="buy" source="Listing page" listingRef={`${l.address}, ${l.city} · ${fmtPrice(l.price)}`} label="Book a tour" style={{ display: "block", marginTop: 16, padding: "13px", fontSize: 15, width: "100%" }} />
          <a href={AGENT.whatsapp} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", marginTop: 10, color: "#fff", background: "#25D366", padding: "13px", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>WhatsApp</a>
          <a href={`tel:${AGENT.phoneRaw}`} style={{ display: "block", textAlign: "center", marginTop: 10, color: "var(--text)", padding: "13px", borderRadius: 999, fontSize: 14, textDecoration: "none", border: "1px solid var(--line)" }}>Call {AGENT.phone}</a>
        </div>
      </div>

      {/* ABOUT — на всю ширину */}
      <h3 style={{ fontSize: 20, marginTop: 40, marginBottom: 10 }}>About this home</h3>
      <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--muted)", margin: 0, maxWidth: 760 }}>{l.description}</p>

      {/* LOCATION — на всю ширину */}
      {l.lat && l.lng && (
        <>
          <h3 style={{ fontSize: 20, marginTop: 40, marginBottom: 12 }}>Location</h3>
          <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 12 }}>{l.address}, {l.city}, {l.state} {l.zip}</div>
          <div style={{ height: 380 }}>
            <MapView listings={[l]} />
          </div>
        </>
      )}

      {/* ADDITIONAL INFORMATION — на всю ширину, 2 колонки */}
      {l.details && l.details.length > 0 && (
        <>
          <h3 style={{ fontSize: 20, marginTop: 40, marginBottom: 12 }}>Additional information</h3>
          <div style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="addinfo">
            {l.details.map((d, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", fontSize: 14, borderTop: "1px solid var(--line)" }}>
                <span style={{ color: "var(--muted)" }}>{d.label}</span>
                <span style={{ color: "var(--text)", fontWeight: 500 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MORTGAGE — на всю ширину снизу */}
      <h3 style={{ fontSize: 20, marginTop: 40, marginBottom: 12 }}>Estimate your monthly payment</h3>
      <MortgageCalculator price={l.price} listingRef={`${l.address}, ${l.city}`} taxAnnual={l.taxAnnual} hoaMonthly={l.hoaMonthly} />

      {/* SIMILAR PROPERTIES — меньшие карточки */}
      {similar.length > 0 && (
        <>
          <h3 style={{ fontSize: 20, marginTop: 44, marginBottom: 16 }}>Similar properties</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }} className="similar">
            {similar.map(s => (
              <Link key={s.id} href={`/listings/${s.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }} className="simcard">
                <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", background: "var(--surface-2)" }}>
                  <div className="simcard-img" style={{ width: "100%", height: "100%", backgroundImage: `url("${s.photos[0]}")`, backgroundSize: "cover", backgroundPosition: "center", transition: "transform .5s cubic-bezier(.2,.7,.2,1)" }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", marginTop: 8 }}>{fmtPrice(s.price)}</div>
                <div style={{ fontSize: 12, color: "var(--text)", marginTop: 2 }}>{s.beds ? `${s.beds} bd · ` : ""}{s.baths ? `${s.baths} ba · ` : ""}{s.sqft ? `${s.sqft.toLocaleString()} sqft` : ""}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.address}, {s.city}</div>
              </Link>
            ))}
          </div>
          <style>{`.simcard:hover .simcard-img{ transform: scale(1.06); } @media(max-width:720px){ .similar{ grid-template-columns:repeat(2,1fr) !important; } }`}</style>
        </>
      )}

      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
        {l.mlsId && <span>MLS®: {l.mlsId} · </span>}{l.courtesy || "Courtesy of BeachesMLS"} · Listing data via BeachesMLS IDX
      </div>
      <div style={{ height: 40 }} />
      <style>{`@media(max-width:820px){ .dgrid{ grid-template-columns:1fr !important; } .gal{ grid-template-columns:1fr !important; height:auto !important; } .addinfo{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}

// Аватар брокера: фото /ays.jpg, fallback на инициалы если файла нет.
function AgentAvatar() {
  const [err, setErr] = useState(false);
  if (err || !AGENT.photo) {
    return <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(44,90,80,.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--coral)", fontWeight: 600, flexShrink: 0 }}>AI</div>;
  }
  return <img src={AGENT.photo} alt={AGENT.name} onError={() => setErr(true)} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", objectPosition: "top", flexShrink: 0 }} />;
}
