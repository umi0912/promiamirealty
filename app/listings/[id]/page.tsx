"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { type Listing, LISTINGS, AGENT, fmtPrice } from "@/lib/data";
import MortgageCalculator from "@/components/MortgageCalculator";
import BookButton from "@/components/BookButton";

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [l, setL] = useState<Listing | null>(() => LISTINGS.find(x => x.id === id) || null);
  const [loading, setLoading] = useState(!l);
  const [active, setActive] = useState(0);

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

  if (loading) return <div style={{ paddingTop: 140, textAlign: "center", color: "var(--muted)" }}>Loading listing…</div>;
  if (!l) return <div style={{ paddingTop: 140, textAlign: "center", color: "var(--muted)" }}>Listing not found. <Link href="/search" style={{ color: "var(--indigo)" }}>Back to search</Link></div>;
  const stats = [
    [l.beds, "Bedrooms"], [l.baths, "Bathrooms"],
    [l.sqft.toLocaleString(), "Sq ft"], [l.yearBuilt, "Year built"],
  ] as const;
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "88px 24px 0" }}>
      <Link href="/search" style={{ color: "var(--muted)", fontSize: 14, textDecoration: "none" }}>← Back to search</Link>

      {/* GALLERY */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, height: 380, marginTop: 16 }} className="gal">
        <div style={{ backgroundImage: `url(${l.photos[active]})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 12 }} />
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 10 }}>
          {l.photos.slice(1, 3).map((p, i) => (
            <div key={i} onClick={() => setActive(i + 1)} style={{ backgroundImage: `url(${p})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 12, cursor: "pointer" }} />
          ))}
        </div>
      </div>
      {l.photos.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {l.photos.map((p, i) => (
            <div key={i} onClick={() => setActive(i)} style={{ width: 64, height: 48, borderRadius: 8, backgroundImage: `url(${p})`, backgroundSize: "cover", backgroundPosition: "center", cursor: "pointer", border: active === i ? "2px solid var(--coral)" : "2px solid transparent" }} />
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40, marginTop: 28 }} className="dgrid">
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <span style={{ background: "rgba(242,116,44,.18)", color: "var(--coral)", fontSize: 12, fontWeight: 500, padding: "4px 11px", borderRadius: 999 }}>{l.status}</span>
            <span style={{ background: "var(--surface-2)", color: "var(--muted)", fontSize: 12, padding: "4px 11px", borderRadius: 999 }}>{l.type}</span>
          </div>
          <div style={{ fontSize: "clamp(32px,5vw,44px)", fontFamily: "Space Grotesk, sans-serif", fontWeight: 500, lineHeight: 1 }}>{fmtPrice(l.price)}</div>
          <div style={{ fontSize: 16, color: "var(--muted)", marginTop: 8 }}>{l.address}, {l.city}, {l.state} {l.zip}</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 24 }}>
            {stats.map(([v, lab], i) => (
              <div key={i} style={{ background: "var(--surface)", borderRadius: 12, padding: "16px 12px", textAlign: "center", border: "1px solid var(--line)" }}>
                <div style={{ fontSize: 22, fontWeight: 500, fontFamily: "Space Grotesk, sans-serif" }}>{v}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{lab}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 18, marginTop: 32, marginBottom: 10 }}>About this home</h3>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--muted)", margin: 0 }}>{l.description}</p>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
            {l.mlsId && <span>MLS®: {l.mlsId} · </span>}{l.courtesy || "Courtesy of BeachesMLS"} · Listing data via BeachesMLS IDX
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <MortgageCalculator price={l.price} listingRef={`${l.address}, ${l.city}`} />
          <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 18 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(242,116,44,.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--coral)", fontWeight: 500 }}>AI</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{AGENT.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{AGENT.brokerage} · {AGENT.license}</div>
              </div>
            </div>
            <BookButton intent="buy" source="Listing page" listingRef={`${l.address}, ${l.city} · ${fmtPrice(l.price)}`} label="Book a tour" style={{ display: "block", marginTop: 16, padding: "12px", fontSize: 14, width: "100%" }} />
            <a href={`tel:${AGENT.phoneRaw}`} style={{ display: "block", textAlign: "center", marginTop: 10, color: "var(--text)", padding: "12px", borderRadius: 999, fontSize: 14, textDecoration: "none", border: "1px solid var(--line)" }}>Call {AGENT.phone}</a>
          </div>
        </div>
      </div>
      <div style={{ height: 40 }} />
      <style>{`@media(max-width:820px){ .dgrid{ grid-template-columns:1fr !important; } .gal{ grid-template-columns:1fr !important; height:auto !important; } }`}</style>
    </div>
  );
}
