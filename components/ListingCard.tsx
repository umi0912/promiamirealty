"use client";
import Link from "next/link";
import { Listing, fmtPrice } from "@/lib/data";

export default function ListingCard({ l, h = 240 }: { l: Listing; h?: number }) {
  return (
    <Link href={`/listings/${l.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="lcard lift" style={{ position: "relative", height: h, borderRadius: 14, overflow: "hidden", background: "var(--surface-2)" }}>
        <div className="lcard-img" style={{ position: "absolute", inset: 0, backgroundImage: `url(${l.photos[0]})`, backgroundSize: "cover", backgroundPosition: "center", transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(22,18,28,0) 45%,rgba(22,18,28,.9) 100%)" }} />
        <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(242,116,44,.92)", color: "#fff", fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 999 }}>{l.status}</span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 14 }}>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 500, fontFamily: "Fraunces, serif" }}>{fmtPrice(l.price)}</div>
          <div style={{ color: "rgba(255,255,255,.85)", fontSize: 13, marginTop: 2 }}>{l.address}, {l.city}</div>
          <div style={{ color: "rgba(255,255,255,.7)", fontSize: 12, marginTop: 4 }}>{l.beds} bd · {l.baths} ba · {l.sqft.toLocaleString()} sqft</div>
        </div>
      </div>
      <style>{`.lcard:hover .lcard-img{ transform: scale(1.08); }`}</style>
    </Link>
  );
}
