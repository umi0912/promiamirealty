"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { type Listing, fmtPrice } from "@/lib/data";

// Горизонтальный карусель листингов с фото-слайдером на каждой карточке (как SERHANT).
export default function ListingCarousel({ listings }: { listings: Listing[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".lc-card");
    const step = card ? card.offsetWidth + 18 : 340;
    el.scrollBy({ left: dir * step * 1.2, behavior: "smooth" });
  };
  if (!listings.length) return null;
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => scrollBy(-1)} aria-label="Previous" className="lc-nav lc-nav-l">‹</button>
      <button onClick={() => scrollBy(1)} aria-label="Next" className="lc-nav lc-nav-r">›</button>
      <div ref={trackRef} className="lc-track">
        {listings.map(l => <CarouselCard key={l.id} l={l} />)}
      </div>
      <style>{`
        .lc-track{ display:flex; gap:18px; overflow-x:auto; scroll-snap-type:x mandatory; padding:4px 2px 8px; scrollbar-width:none; -ms-overflow-style:none; }
        .lc-track::-webkit-scrollbar{ display:none; }
        .lc-card{ flex:0 0 340px; scroll-snap-align:start; }
        @media(max-width:760px){ .lc-card{ flex-basis:80%; } }
        .lc-nav{ position:absolute; top:38%; transform:translateY(-50%); width:44px; height:44px; border-radius:50%; border:none; cursor:pointer; background:#fff; color:var(--indigo); font-size:26px; line-height:1; display:flex; align-items:center; justify-content:center; z-index:4; box-shadow:0 4px 16px rgba(0,0,0,.18); transition:transform .2s; }
        .lc-nav:hover{ transform:translateY(-50%) scale(1.08); }
        .lc-nav-l{ left:-10px; } .lc-nav-r{ right:-10px; }
        @media(max-width:760px){ .lc-nav{ display:none; } }
      `}</style>
    </div>
  );
}

function CarouselCard({ l }: { l: Listing }) {
  const pics = l.photos.slice(0, 10);
  const [pi, setPi] = useState(0);
  const nav = (e: React.MouseEvent, d: number) => { e.preventDefault(); e.stopPropagation(); setPi(p => (p + d + pics.length) % pics.length); };
  return (
    <Link href={`/listings/${l.id}`} className="lc-card scard" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 14, overflow: "hidden", background: "var(--surface-2)" }}>
        <div className="scard-img" style={{ position: "absolute", inset: 0, backgroundImage: `url("${pics[pi]}")`, backgroundSize: "cover", backgroundPosition: "center", transition: "transform .5s cubic-bezier(.2,.7,.2,1)" }} />
        <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(28,28,28,.82)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "5px 11px", borderRadius: 8, zIndex: 2 }}>{l.status === "Coming Soon" ? "Coming soon" : "Active"}</span>
        {pics.length > 1 && (
          <>
            <button className="scard-arrow scard-prev" onClick={e => nav(e, -1)} aria-label="Previous photo">‹</button>
            <button className="scard-arrow scard-next" onClick={e => nav(e, 1)} aria-label="Next photo">›</button>
            <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5, zIndex: 2 }}>
              {pics.map((_, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === pi ? "#fff" : "rgba(255,255,255,.5)", boxShadow: "0 1px 2px rgba(0,0,0,.4)" }} />)}
            </div>
          </>
        )}
      </div>
      <div style={{ padding: "10px 2px 0" }}>
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Space Grotesk, sans-serif" }}>{fmtPrice(l.price)}</div>
        <div style={{ fontSize: 14, color: "var(--text)", marginTop: 4 }}>{l.beds ? `${l.beds} bd · ` : ""}{l.baths ? `${l.baths} ba · ` : ""}{l.sqft ? `${l.sqft.toLocaleString()} sqft` : ""}</div>
        <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>{l.address}{l.city ? `, ${l.city}` : ""}</div>
      </div>
    </Link>
  );
}
