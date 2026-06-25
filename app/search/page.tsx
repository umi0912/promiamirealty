"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { type Listing, fmtPrice, fmtPriceShort } from "@/lib/data";

// MapLibre использует window — грузим только на клиенте.
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div style={{ height: "100%", minHeight: 420, borderRadius: 16, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>Loading map…</div>,
});

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 140, textAlign: "center", color: "var(--muted)" }}>Loading…</div>}>
      <Search />
    </Suspense>
  );
}

type Status = "active" | "coming" | "all";
type TypeKey = "all" | "condo" | "house" | "townhouse" | "land";

function Search() {
  const sp = useSearchParams();
  const [q, setQ] = useState("");
  const [type, setType] = useState<TypeKey>("all");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999999);
  const [senior55, setSenior55] = useState(false);
  const [status, setStatus] = useState<Status>("active");

  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const [openPop, setOpenPop] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  // prefill из ?city=
  useEffect(() => { const c = sp.get("city"); if (c) setQ(c); }, [sp]);

  const buildQuery = useCallback((pg: number) => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (type !== "all") p.set("type", type);
    if (beds) p.set("beds", String(beds));
    if (baths) p.set("baths", String(baths));
    if (minPrice) p.set("minPrice", String(minPrice));
    if (maxPrice < 99999999) p.set("maxPrice", String(maxPrice));
    if (senior55) p.set("senior55", "1");
    p.set("status", status);
    p.set("page", String(pg));
    return p.toString();
  }, [q, type, beds, baths, minPrice, maxPrice, senior55, status]);

  // дебаунс: при смене фильтров грузим страницу 1
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    setLoading(true);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/listings?${buildQuery(1)}`);
        const data = await res.json();
        setListings(data.listings || []);
        setTotal(data.total ?? 0);
        setHasMore(!!data.hasMore);
        setPage(1);
        setSource(data.source || "");
      } catch { setListings([]); setTotal(0); setHasMore(false); }
      setLoading(false);
    }, 350);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [buildQuery]);

  const loadMore = async () => {
    const next = page + 1;
    const res = await fetch(`/api/listings?${buildQuery(next)}`);
    const data = await res.json();
    setListings(prev => [...prev, ...(data.listings || [])]);
    setHasMore(!!data.hasMore);
    setPage(next);
  };

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const share = (e: React.MouseEvent, l: Listing) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/listings/${l.id}`;
    if (navigator.share) navigator.share({ title: l.address, url }).catch(() => {});
    else navigator.clipboard?.writeText(url);
  };

  const priceLabel = minPrice || maxPrice < 99999999
    ? `${minPrice ? fmtPriceShort(minPrice) : "$0"}–${maxPrice < 99999999 ? fmtPriceShort(maxPrice) : "∞"}`
    : "Any price";
  const typeLabel = { all: "All property types", condo: "Condo", house: "House", townhouse: "Townhouse", land: "Land" }[type];
  const statusLabel = { active: "For sale", coming: "Coming soon", all: "For sale + soon" }[status];
  const bedsLabel = beds ? `${beds}+ beds` : "All beds";
  const bathsLabel = baths ? `${baths}+ baths` : "All baths";

  return (
    <div style={{ paddingTop: 104, background: "#fff", minHeight: "100vh" }}>
      {/* STICKY FILTER BAR */}
      <div style={{ position: "sticky", top: 96, zIndex: 30, background: "#fff", borderBottom: "1px solid var(--line)", padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", maxWidth: 1600, margin: "0 auto" }}>
          {/* search */}
          <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 360 }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>⌕</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="City, neighborhood, ZIP code…"
              style={{ width: "100%", height: 44, paddingLeft: 38, paddingRight: 16, borderRadius: 999, border: "1px solid var(--line)", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" }} />
          </div>

          {/* pills */}
          <Pill label={statusLabel} active={status !== "active"} open={openPop === "status"} onClick={() => setOpenPop(openPop === "status" ? null : "status")}>
            {(["active", "coming", "all"] as Status[]).map(s => (
              <PopRow key={s} selected={status === s} onClick={() => { setStatus(s); setOpenPop(null); }}>
                {{ active: "For sale", coming: "Coming soon", all: "For sale + Coming soon" }[s]}
              </PopRow>
            ))}
          </Pill>

          <Pill label={priceLabel} active={!!minPrice || maxPrice < 99999999} open={openPop === "price"} onClick={() => setOpenPop(openPop === "price" ? null : "price")} wide>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, minWidth: 220 }}>
              <label style={popLabelStyle}>Min price
                <input type="number" value={minPrice || ""} onChange={e => setMinPrice(+e.target.value || 0)} placeholder="$0" style={popInputStyle} />
              </label>
              <label style={popLabelStyle}>Max price
                <input type="number" value={maxPrice < 99999999 ? maxPrice : ""} onChange={e => setMaxPrice(e.target.value ? +e.target.value : 99999999)} placeholder="Any" style={popInputStyle} />
              </label>
            </div>
          </Pill>

          <Pill label={typeLabel} active={type !== "all"} open={openPop === "type"} onClick={() => setOpenPop(openPop === "type" ? null : "type")}>
            {(["all", "condo", "house", "townhouse", "land"] as TypeKey[]).map(tk => (
              <PopRow key={tk} selected={type === tk} onClick={() => { setType(tk); setOpenPop(null); }}>
                {{ all: "All property types", condo: "Condo", house: "House", townhouse: "Townhouse", land: "Land" }[tk]}
              </PopRow>
            ))}
          </Pill>

          <Pill label={bedsLabel} active={!!beds} open={openPop === "beds"} onClick={() => setOpenPop(openPop === "beds" ? null : "beds")}>
            {[0, 1, 2, 3, 4, 5].map(n => (
              <PopRow key={n} selected={beds === n} onClick={() => { setBeds(n); setOpenPop(null); }}>{n === 0 ? "All beds" : `${n}+ beds`}</PopRow>
            ))}
          </Pill>

          <Pill label={bathsLabel} active={!!baths} open={openPop === "baths"} onClick={() => setOpenPop(openPop === "baths" ? null : "baths")}>
            {[0, 1, 2, 3, 4].map(n => (
              <PopRow key={n} selected={baths === n} onClick={() => { setBaths(n); setOpenPop(null); }}>{n === 0 ? "All baths" : `${n}+ baths`}</PopRow>
            ))}
          </Pill>

          {/* 55+ toggle */}
          <button onClick={() => setSenior55(v => !v)} style={{
            height: 40, padding: "0 16px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            border: senior55 ? "1px solid var(--indigo)" : "1px solid var(--line)",
            background: senior55 ? "var(--indigo)" : "#fff", color: senior55 ? "#fff" : "var(--text)",
          }}>55+ {senior55 ? "✓" : ""}</button>

          <div style={{ flex: 1 }} />

          {/* List / Map toggle */}
          <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden" }}>
            {(["list", "map"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none",
                background: view === v ? "var(--indigo)" : "#fff", color: view === v ? "#fff" : "var(--text)",
                textTransform: "capitalize",
              }}>{v}</button>
            ))}
          </div>
        </div>
        {openPop && <div onClick={() => setOpenPop(null)} style={{ position: "fixed", inset: 0, zIndex: 25 }} />}
      </div>

      {/* HEADER ROW */}
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "24px 24px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,3vw,30px)", margin: 0 }}>Real Estate &amp; Homes for Sale</h1>
          <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
            {loading ? "Searching…" : total < 0 ? `${listings.length.toLocaleString()}+ results` : `${total.toLocaleString()} results`}
            {source === "demo" && <span style={{ marginLeft: 8, fontSize: 12, color: "var(--amber)" }}>· demo data (set SPARK_ACCESS_TOKEN for live MLS)</span>}
            {source === "demo-fallback" && <span style={{ marginLeft: 8, fontSize: 12, color: "var(--amber)" }}>· MLS unavailable, showing demo</span>}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "8px 24px 80px" }}>
        {view === "map" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="map-split">
            <div style={{ position: "sticky", top: 180, alignSelf: "start", height: "calc(100vh - 200px)", minHeight: 480 }}>
              <MapView listings={listings} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }} className="map-cards">
              {listings.map(l => <Card key={l.id} l={l} saved={saved.has(l.id)} onSave={toggleSave} onShare={share} />)}
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="grid4">
            {listings.map(l => <Card key={l.id} l={l} saved={saved.has(l.id)} onSave={toggleSave} onShare={share} />)}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>No listings match — adjust filters.</div>
        )}

        {/* LOAD MORE */}
        {listings.length > 0 && hasMore && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button onClick={loadMore} style={{ padding: "13px 32px", borderRadius: 999, border: "1px solid var(--line)", background: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Load more{total > 0 ? ` (${listings.length.toLocaleString()} of ${total.toLocaleString()})` : ""}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:1280px){ .grid4{ grid-template-columns:repeat(3,1fr) !important; } }
        @media(max-width:920px){ .grid4{ grid-template-columns:repeat(2,1fr) !important; } .map-split{ grid-template-columns:1fr !important; } .map-cards{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:560px){ .grid4{ grid-template-columns:1fr !important; } .map-cards{ grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}

// ---------- CARD ----------
function Card({ l, saved, onSave, onShare }: { l: Listing; saved: boolean; onSave: (e: React.MouseEvent, id: string) => void; onShare: (e: React.MouseEvent, l: Listing) => void }) {
  const coming = l.status === "Coming Soon";
  return (
    <Link href={`/listings/${l.id}`} className="scard" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden", background: "var(--surface-2)" }}>
        <div className="scard-img" style={{ position: "absolute", inset: 0, backgroundImage: `url(${l.photos[0]})`, backgroundSize: "cover", backgroundPosition: "center", transition: "transform .5s cubic-bezier(.2,.7,.2,1)" }} />
        {/* status badge */}
        <span style={{ position: "absolute", top: 10, left: 10, background: coming ? "rgba(46,26,74,.92)" : "rgba(28,28,28,.82)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "5px 11px", borderRadius: 8 }}>{coming ? "Coming soon" : "Active"}</span>
        {/* heart + share */}
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8 }}>
          <button onClick={e => onSave(e, l.id)} aria-label="Save" style={iconBtn}>{saved ? "♥" : "♡"}</button>
          <button onClick={e => onShare(e, l)} aria-label="Share" style={iconBtn}>➤</button>
        </div>
        {/* courtesy overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 12px 8px", background: "linear-gradient(180deg,transparent,rgba(0,0,0,.6))", color: "rgba(255,255,255,.92)", fontSize: 11 }}>{l.courtesy || "Courtesy of BeachesMLS"}</div>
      </div>
      {/* info */}
      <div style={{ padding: "10px 2px 0" }}>
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Space Grotesk, sans-serif" }}>{fmtPrice(l.price)}</div>
        <div style={{ fontSize: 14, color: "var(--text)", marginTop: 4 }}>
          {l.beds ? `${l.beds} bd · ` : ""}{l.baths ? `${l.baths} ba · ` : ""}{l.sqft ? `${l.sqft.toLocaleString()} sqft` : ""}
        </div>
        <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{l.address}{l.city ? `, ${l.city} ${l.state} ${l.zip}` : ""}</div>
        {l.mlsId && <div style={{ fontSize: 11, color: "rgba(0,0,0,.45)", marginTop: 6 }}>MLS®: {l.mlsId}</div>}
      </div>
      <style>{`.scard:hover .scard-img{ transform: scale(1.06); }`}</style>
    </Link>
  );
}

// ---------- PILL + POPOVER ----------
function Pill({ label, active, open, onClick, children, wide }: { label: string; active: boolean; open: boolean; onClick: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{ position: "relative" }}>
      <button onClick={onClick} style={{
        height: 40, padding: "0 16px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
        border: active || open ? "1px solid var(--indigo)" : "1px solid var(--line)",
        background: active ? "var(--indigo)" : "#fff", color: active ? "#fff" : "var(--text)",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>{label} <span style={{ fontSize: 10, opacity: .6 }}>▾</span></button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 40, background: "#fff", borderRadius: 12, border: "1px solid var(--line)", boxShadow: "0 12px 32px rgba(0,0,0,.14)", overflow: "hidden", minWidth: wide ? 220 : 180, padding: wide ? 0 : 6 }}>
          {children}
        </div>
      )}
    </div>
  );
}
function PopRow({ children, selected, onClick }: { children: React.ReactNode; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 14, cursor: "pointer", border: "none", borderRadius: 8,
      background: selected ? "var(--surface)" : "transparent", color: "var(--text)", fontWeight: selected ? 700 : 500,
    }}>{children}</button>
  );
}

const iconBtn: React.CSSProperties = { width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(40,40,40,.55)", color: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" };
const popLabelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--muted)" };
const popInputStyle: React.CSSProperties = { height: 40, border: "1px solid var(--line)", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none" };
