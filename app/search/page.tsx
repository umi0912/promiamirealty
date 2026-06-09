"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { LISTINGS, fmtPrice, fmtPriceShort } from "@/lib/data";

export default function Search() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [beds, setBeds] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999999);
  const [hot, setHot] = useState<string | null>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return LISTINGS.filter(l => {
      const m = !term || l.address.toLowerCase().includes(term) || l.city.toLowerCase().includes(term) || l.zip.includes(term);
      return m && (type === "all" || l.typeKey === type) && l.beds >= beds && l.price <= maxPrice;
    });
  }, [q, type, beds, maxPrice]);

  // нормализация координат в рамку карты (демо; реальная карта — Google/Mapbox)
  const lats = LISTINGS.map(l => l.lat), lngs = LISTINGS.map(l => l.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats), minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const px = (l: typeof LISTINGS[0]) => ({
    left: `${8 + ((l.lng - minLng) / (maxLng - minLng || 1)) * 84}%`,
    top: `${12 + ((maxLat - l.lat) / (maxLat - minLat || 1)) * 76}%`,
  });

  return (
    <div style={{ paddingTop: 72 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
        <h1 style={{ fontSize: "clamp(28px,4vw,42px)", margin: "0 0 4px" }}>Search listings</h1>
        <p style={{ color: "var(--muted)", fontSize: 15, margin: "0 0 24px" }}>Live across Miami-Dade & Broward · demo data, real listings via BeachesMLS</p>

        {/* FILTERS */}
        <div style={{ background: "var(--surface)", borderRadius: 16, padding: 16, border: "1px solid var(--line)", marginBottom: 20 }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="City, neighborhood, address or ZIP…" style={{ width: "100%", height: 46, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "0 16px", fontSize: 15, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
            <select value={type} onChange={e => setType(e.target.value)} style={selStyle}><option value="all">Any type</option><option value="condo">Condo</option><option value="house">House</option></select>
            <select value={beds} onChange={e => setBeds(+e.target.value)} style={selStyle}><option value={0}>Any beds</option><option value={1}>1+</option><option value={2}>2+</option><option value={3}>3+</option><option value={4}>4+</option></select>
            <select value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={selStyle}><option value={99999999}>No max</option><option value={600000}>$600k</option><option value={1000000}>$1M</option><option value={1500000}>$1.5M</option><option value={2500000}>$2.5M</option></select>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 12 }}>{results.length} objects found</div>
        </div>

        {/* MAP + LIST */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 80 }} className="sgrid">
          <div style={{ position: "sticky", borderRadius: 16, overflow: "hidden", background: "#11203a", top: 90, alignSelf: "start", height: 460 }} className="smap">
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#16263f,#0e1c30)" }} />
            <svg viewBox="0 0 400 460" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
              <path d="M0,300 Q100,280 200,295 T400,290 L400,460 L0,460 Z" fill="#0c1830" opacity=".6" />
              <path d="M40,60 L370,80 M30,160 L380,170 M50,260 L360,270 M40,360 L370,370" stroke="#1f3252" strokeWidth="1" />
              <path d="M110,30 L120,440 M220,25 L230,445 M320,35 L310,440" stroke="#1f3252" strokeWidth="1" />
            </svg>
            {results.map(l => (
              <Link key={l.id} href={`/listings/${l.id}`} onMouseEnter={() => setHot(l.id)} onMouseLeave={() => setHot(null)}
                style={{ position: "absolute", ...px(l), transform: "translate(-50%,-100%)", textDecoration: "none", zIndex: hot === l.id ? 10 : 1 }}>
                <span style={{ display: "inline-block", background: hot === l.id ? "var(--coral)" : "rgba(22,18,28,.88)", color: "#fff", fontSize: 12, fontWeight: 500, padding: "5px 10px", borderRadius: 999, whiteSpace: "nowrap", transition: "all .2s", transform: hot === l.id ? "scale(1.12)" : "scale(1)" }}>{fmtPriceShort(l.price)}</span>
              </Link>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {results.map(l => (
              <Link key={l.id} href={`/listings/${l.id}`} onMouseEnter={() => setHot(l.id)} onMouseLeave={() => setHot(null)}
                style={{ display: "flex", gap: 12, background: hot === l.id ? "var(--surface-2)" : "var(--surface)", border: `1px solid ${hot === l.id ? "var(--coral)" : "var(--line)"}`, borderRadius: 14, padding: 10, textDecoration: "none", transition: "all .2s" }}>
                <div style={{ width: 110, height: 84, borderRadius: 10, backgroundImage: `url(${l.photos[0]})`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 500, fontFamily: "Fraunces, serif", color: "var(--text)" }}>{fmtPrice(l.price)}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{l.address}, {l.city}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{l.beds} bd · {l.baths} ba · {l.sqft.toLocaleString()} sqft</div>
                </div>
              </Link>
            ))}
            {results.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>No listings match — adjust filters.</div>}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:820px){ .sgrid{ grid-template-columns:1fr !important; } .smap{ position:relative !important; top:0 !important; height:300px !important; min-height:300px !important; } }`}</style>
    </div>
  );
}
const selStyle: React.CSSProperties = { height: 44, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "0 12px", fontSize: 14, outline: "none" };
