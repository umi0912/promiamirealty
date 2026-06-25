"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LISTINGS, fmtPrice, fmtPriceShort } from "@/lib/data";

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 120, textAlign: "center", color: "var(--muted)" }}>Loading…</div>}>
      <Search />
    </Suspense>
  );
}

function Search() {
  const sp = useSearchParams();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [beds, setBeds] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999999);
  const [senior55, setSenior55] = useState(false);

  useEffect(() => {
    const city = sp.get("city");
    if (city) setQ(city);
  }, [sp]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return LISTINGS.filter(l => {
      const m = !term || l.address.toLowerCase().includes(term) || l.city.toLowerCase().includes(term) || l.zip.includes(term);
      return m && (type === "all" || l.typeKey === type) && l.beds >= beds && l.price <= maxPrice && (!senior55 || l.senior55);
    });
  }, [q, type, beds, maxPrice, senior55]);

  // нормализация координат в рамку карты (демо; реальная карта — Google/Mapbox)
  const lats = LISTINGS.map(l => l.lat), lngs = LISTINGS.map(l => l.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats), minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const px = (l: typeof LISTINGS[0]) => ({
    left: `${8 + ((l.lng - minLng) / (maxLng - minLng || 1)) * 84}%`,
    top: `${12 + ((maxLat - l.lat) / (maxLat - minLat || 1)) * 76}%`,
  });

  return (
    <div style={{ paddingTop: 72, background: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "24px" }}>
        <h1 style={{ fontSize: "clamp(28px,4vw,42px)", margin: "0 0 8px" }}>Search listings</h1>
        <p style={{ color: "var(--muted)", fontSize: 15, margin: "0 0 24px" }}>Live across Miami-Dade & Broward · demo data, real listings via BeachesMLS</p>

        {/* STICKY FILTER BAR */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid var(--line)", marginBottom: 32, position: "sticky", top: 72, zIndex: 30, boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center" }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="City, neighborhood, address, ZIP…" style={{ height: 44, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "0 16px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <select value={type} onChange={e => setType(e.target.value)} style={filterSelectStyle}><option value="all">Any type</option><option value="condo">Condo</option><option value="house">House</option><option value="townhouse">Townhouse</option><option value="land">Land</option></select>
            <select value={beds} onChange={e => setBeds(+e.target.value)} style={filterSelectStyle}><option value={0}>Any beds</option><option value={1}>1+</option><option value={2}>2+</option><option value={3}>3+</option><option value={4}>4+</option></select>
            <input type="number" value={maxPrice >= 99999999 ? "" : maxPrice} onChange={e => setMaxPrice(e.target.value === "" ? 99999999 : +e.target.value)} placeholder="Max price" style={{ ...filterSelectStyle, MozAppearance: "textfield" }} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }}>
              <input type="checkbox" checked={senior55} onChange={e => setSenior55(e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer" }} />
              55+
            </label>
            <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500, whiteSpace: "nowrap" }}>{results.length} found</div>
          </div>
        </div>

        {/* GRID LAYOUT — Map left, Listings 3-in-row right */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 80 }} className="sgrid">
          {/* MAP — sticky */}
          <div style={{ position: "sticky", borderRadius: 16, overflow: "hidden", background: "#11203a", top: 140, alignSelf: "start", height: 520 }} className="smap">
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#16263f,#0e1c30)" }} />
            <svg viewBox="0 0 400 460" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
              <path d="M0,300 Q100,280 200,295 T400,290 L400,460 L0,460 Z" fill="#0c1830" opacity=".6" />
              <path d="M40,60 L370,80 M30,160 L380,170 M50,260 L360,270 M40,360 L370,370" stroke="#1f3252" strokeWidth="1" />
              <path d="M110,30 L120,440 M220,25 L230,445 M320,35 L310,440" stroke="#1f3252" strokeWidth="1" />
            </svg>
            {results.map(l => (
              <Link key={l.id} href={`/listings/${l.id}`} className="mappin"
                style={{ position: "absolute", ...px(l), transform: "translate(-50%,-100%)", textDecoration: "none", zIndex: 2 }}>
                <span style={{ display: "inline-block", background: "rgba(22,18,28,.88)", color: "#fff", fontSize: 12, fontWeight: 500, padding: "5px 10px", borderRadius: 999, whiteSpace: "nowrap", transition: "all .2s" }}>{fmtPriceShort(l.price)}</span>
              </Link>
            ))}
          </div>

          {/* LISTINGS GRID 3-IN-ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="listings-grid">
            {results.map(l => (
              <Link key={l.id} href={`/listings/${l.id}`} className="listing-card"
                style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", textDecoration: "none", transition: "all .2s", position: "relative" }}>
                {/* IMAGE */}
                <div style={{ width: "100%", height: 180, backgroundImage: `url(${l.photos[0]})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                  <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(46,26,74,.92)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999 }}>Active</div>
                </div>
                {/* INFO */}
                <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: "var(--text)" }}>{fmtPrice(l.price)}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, fontWeight: 500 }}>{l.address}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{l.city}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, borderTop: "1px solid var(--line)", paddingTop: 8 }}>{l.beds || "Studio"} bd · {l.baths} ba · {l.sqft.toLocaleString()} sqft</div>
                  <div style={{ fontSize: 11, color: "rgba(0,0,0,.5)", marginTop: 6, fontStyle: "italic" }}>Courtesy of BeachesMLS</div>
                </div>
              </Link>
            ))}
            {results.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--muted)" }}>No listings match — adjust filters.</div>}
          </div>
        </div>
      </div>
      <style>{`
        .listing-card:hover{ border-color: var(--coral) !important; box-shadow: 0 8px 24px rgba(46,26,74,.12) !important; }
        .mappin:hover span{ background: var(--coral) !important; transform: scale(1.12); }
        .mappin:hover{ z-index: 10 !important; }
        @media(max-width:1120px){
          .sgrid{ grid-template-columns:1fr !important; }
          .smap{ position:relative !important; top:0 !important; height:300px !important; }
          .listings-grid{ grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:720px){
          .listings-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}
const filterSelectStyle: React.CSSProperties = { height: 44, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "0 12px", fontSize: 14, outline: "none", cursor: "pointer" };
