"use client";
import Link from "next/link";
import { useEffect } from "react";
import { LISTINGS, AGENT, fmtPrice } from "@/lib/data";
import MortgageCalculator from "@/components/MortgageCalculator";
import AIChat from "@/components/AIChat";

export default function Home() {
  const featured = LISTINGS.filter(l => l.featured);
  const rest = LISTINGS.filter(l => !l.featured).slice(0, 4);
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(20,16,12,.55) 0%,rgba(20,16,12,.3) 40%,rgba(20,16,12,.95) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px", width: "100%" }}>
          <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 18 }}>Miami-Dade · Broward · South Florida</div>
          <h1 style={{ fontSize: "clamp(40px,7vw,82px)", lineHeight: 1.02, margin: 0, maxWidth: 900 }}>Find your place<br />under the Miami sun.</h1>
          <p style={{ fontSize: 18, color: "var(--muted)", maxWidth: 520, marginTop: 24, lineHeight: 1.7 }}>
            Live MLS listings, sharp local insight, and a calm hand from search to closing — with {AGENT.name}.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            <Link href="/search" style={{ background: "var(--coral)", color: "#fff", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Search listings</Link>
            <a href={AGENT.calendly} style={{ background: "rgba(245,239,233,.1)", color: "var(--text)", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none", border: "1px solid var(--line)" }}>Book a consultation</a>
          </div>
        </div>
      </section>

      {/* FEATURED — журнальная мозаика */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0" }}>
        <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 8 }}>Featured</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", margin: 0 }}>Signature residences</h2>
          </div>
          <Link href="/search" style={{ color: "var(--text)", fontSize: 14, textDecoration: "none", opacity: 0.8 }}>View all →</Link>
        </div>
        <div className="mosaic fade-up">
          {featured[0] && (
            <Link href={`/listings/${featured[0].id}`} className="m-big tile">
              <div className="tile-img" style={{ backgroundImage: `url(${featured[0].photos[0]})` }} />
              <div className="tile-ov" /><span className="tile-badge">Featured</span>
              <div className="tile-info"><div className="tile-price" style={{ fontSize: 24 }}>{fmtPrice(featured[0].price)}</div><div className="tile-addr">{featured[0].address}</div><div className="tile-specs">{featured[0].beds} bd · {featured[0].baths} ba · {featured[0].sqft.toLocaleString()} sqft</div></div>
            </Link>
          )}
          {featured.slice(1).map(l => (
            <Link key={l.id} href={`/listings/${l.id}`} className="tile">
              <div className="tile-img" style={{ backgroundImage: `url(${l.photos[0]})` }} />
              <div className="tile-ov" />
              <div className="tile-info"><div className="tile-price">{fmtPrice(l.price)}</div><div className="tile-addr">{l.address}</div></div>
            </Link>
          ))}
          {rest.map(l => (
            <Link key={l.id} href={`/listings/${l.id}`} className="tile">
              <div className="tile-img" style={{ backgroundImage: `url(${l.photos[0]})` }} />
              <div className="tile-ov" />
              <div className="tile-info"><div className="tile-price">{fmtPrice(l.price)}</div><div className="tile-addr">{l.address}</div></div>
            </Link>
          ))}
        </div>
      </section>

      {/* INVESTORS — ключевой блок */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0" }}>
        <Link href="/investors" className="fade-up" style={{ display: "block", textDecoration: "none", position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 340 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1565402170291-8491f14678db?w=1800&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(20,16,12,.92) 0%,rgba(20,16,12,.7) 50%,rgba(20,16,12,.35) 100%)" }} />
          <div style={{ position: "relative", padding: "48px 40px", maxWidth: 600 }}>
            <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 14 }}>Investors — our focus</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", margin: "0 0 16px", lineHeight: 1.06, color: "var(--text)" }}>Miami real estate that pays you back.</h2>
            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, maxWidth: 460, margin: "0 0 24px" }}>
              Cash-flowing rentals, full deal analysis, and rental-market insight. Cap rate, cash-on-cash, and monthly cash flow on every property — before you buy.
            </p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--coral)", color: "#fff", padding: "13px 26px", borderRadius: 999, fontSize: 15, fontWeight: 500 }}>Explore investing →</span>
          </div>
        </Link>
      </section>

      {/* CALC + CONSULT */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0" }}>
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 8 }}>Plan ahead</div>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", margin: "0 0 16px" }}>Know your numbers<br />before you fall in love.</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 420 }}>Estimate a monthly payment on any price, then book time to talk strategy — financing, neighborhoods, and timing.</p>
          </div>
          <MortgageCalculator price={750000} />
        </div>
      </section>

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "80px 24px 0" }}>
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", margin: 0 }}>Let's talk</h2>
          <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 10 }}>Pick a time that works — no pressure, just answers.</p>
        </div>
        <div className="fade-up">
          <iframe src={`${AGENT.calendly}?hide_gdpr_banner=1`} width="100%" height="640" frameBorder="0" title="Book" style={{ borderRadius: 16, border: "1px solid var(--line)", display: "block" }} />
        </div>
      </section>

      <AIChat />
      <style>{`
        .mosaic{ display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:150px; gap:12px; }
        .m-big{ grid-column:span 2; grid-row:span 2; }
        .tile{ position:relative; border-radius:14px; overflow:hidden; text-decoration:none; display:block; background:var(--surface-2); }
        .tile-img{ position:absolute; inset:0; background-size:cover; background-position:center; transition:transform .5s cubic-bezier(.2,.7,.2,1); }
        .tile:hover .tile-img{ transform:scale(1.06); }
        .tile-ov{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(20,16,12,0) 45%,rgba(20,16,12,.9) 100%); }
        .tile-badge{ position:absolute; top:12px; left:12px; background:rgba(216,90,48,.92); color:#fff; font-size:11px; font-weight:500; padding:4px 10px; border-radius:999px; }
        .tile-info{ position:absolute; bottom:0; left:0; right:0; padding:14px; }
        .tile-price{ color:#fff; font-size:17px; font-weight:500; font-family:'Fraunces',serif; }
        .tile-addr{ color:rgba(255,255,255,.82); font-size:12px; margin-top:2px; }
        .tile-specs{ color:rgba(255,255,255,.7); font-size:12px; margin-top:4px; }
        @media (max-width:760px){ .mosaic{ grid-template-columns:repeat(2,1fr); } .m-big{ grid-column:span 2; grid-row:span 1; } }
      `}</style>
    </>
  );
}
