"use client";
import Link from "next/link";
import { useEffect } from "react";
import { WORLD_LAND } from "@/lib/worldmap";
import { LISTINGS, AGENT, fmtPrice } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import MortgageCalculator from "@/components/MortgageCalculator";
import BookButton from "@/components/BookButton";
import AIChat from "@/components/AIChat";

export default function Home() {
  const { t } = useLang();
  const featured = LISTINGS.filter(l => l.featured);
  const rest = LISTINGS.filter(l => !l.featured).slice(0, 4);

  useEffect(() => {
    const c = document.getElementById("globe") as HTMLCanvasElement | null;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 680;
    c.width = size * dpr; c.height = size * dpr;
    ctx.scale(dpr, dpr);
    const R = 310, cx = size / 2, cy = size / 2;

    // real world landmass points [lat, lon]
    const land = WORLD_LAND.map(([la, lo]) => ({ lat: la * Math.PI / 180, lon: lo * Math.PI / 180 }));
    const miami = { lat: 25.76 * Math.PI / 180, lon: -80.19 * Math.PI / 180 };

    const project = (lat: number, lon: number, rotation: number) => {
      const xs = Math.cos(lat) * Math.sin(lon + rotation);
      const ys = Math.sin(lat);
      const zs = Math.cos(lat) * Math.cos(lon + rotation);
      return { px: cx + xs * R, py: cy - ys * R, z: zs };
    };

    // start rotated so the Americas (Miami) face viewer
    // start so Miami (palm) sits on the LEFT side of the visible sphere, near the text
    let rot = (80.19 - 45) * Math.PI / 180, raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      rot += 0.0017;
      for (const p of land) {
        const { px, py, z } = project(p.lat, p.lon, rot);
        if (z < -0.02) continue;
        const depth = (z + 1) / 2;
        ctx.beginPath();
        ctx.arc(px, py, 0.8 + depth * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(46,26,74,${0.12 + depth * 0.62})`;
        ctx.fill();
      }
      // palm emoji marker on Miami — on a glossy white disc (crisp, no transparency)
      const m = project(miami.lat, miami.lon, rot);
      if (m.z > 0.05) {
        const mx = m.px, my = m.py;
        ctx.save();
        // glossy white disc backing
        ctx.beginPath(); ctx.arc(mx, my, 19, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(255,138,61,.75)"; ctx.shadowBlur = 16;
        ctx.fill();
        // thin amber ring
        ctx.beginPath(); ctx.arc(mx, my, 19, 0, Math.PI * 2);
        ctx.lineWidth = 2; ctx.strokeStyle = "#ff8a3d"; ctx.shadowBlur = 0; ctx.stroke();
        // palm emoji, full opacity, centered
        ctx.globalAlpha = 1;
        ctx.font = "26px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("\uD83C\uDF34", mx, my + 1);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // count-up animation for stats
  useEffect(() => {
    const el = document.querySelector(".statsgrid");
    if (!el) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    let done = false;
    const run = () => {
      if (done) return; done = true;
      targets.forEach(node => {
        const raw = node.getAttribute("data-count") || "";
        const num = parseFloat(raw.replace(/[^0-9.]/g, "")) || 0;
        const prefix = raw.startsWith("$") ? "$" : "";
        const suffix = raw.replace(/[$0-9.]/g, "");
        const dur = 1100, t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = Math.round(num * eased);
          node.textContent = prefix + val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) run(); });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);


  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=2000&q=80"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-miami-beach-4818/1080p.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(46,26,74,.45) 0%,rgba(46,26,74,.15) 40%,rgba(255,255,255,.95) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px", width: "100%" }}>
          <div  style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 18 }}>{t("home.eyebrow")}</div>
          <h1 className="" style={{ fontSize: "clamp(40px,7vw,82px)", lineHeight: 1.02, margin: 0, maxWidth: 900 }}>{t("home.title")}</h1>
          <p className="" style={{ fontSize: 18, color: "var(--muted)", maxWidth: 520, marginTop: 24, lineHeight: 1.7 }}>
            {t("home.subtitle")}
          </p>
          <div className="" style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            <Link href="/search" className="btn" style={{ background: "var(--coral)", color: "#fff", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>{t("home.cta.search")}</Link>
            <BookButton intent="buy" source="Home hero" label={t("home.cta.book")} variant="outline" style={{ background: "rgba(246,241,236,.1)", padding: "14px 28px", fontSize: 15 }} />
          </div>
        </div>
      </section>

      {/* STATS — о компании (SERHANT-style: цифры слева + globe справа) */}
      <section style={{ background: "var(--bg2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="statsgrid" style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 50, alignItems: "center" }}>
          <div>
            <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 18, fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 }}>{t("home.stats.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", margin: "0 0 40px", lineHeight: 1.02 }}>{t("home.stats.title")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "44px 30px", maxWidth: 460 }}>
              {[
                { v: "120+", k: "home.stats.deals" as const },
                { v: "$85M+", k: "home.stats.volume" as const },
                { v: "6", k: "home.stats.cities" as const },
                { v: "3", k: "home.stats.langs" as const },
              ].map((s, i) => (
                <div key={i}>
                  <div data-count={s.v} style={{ fontSize: "clamp(40px,5vw,64px)", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", color: "var(--indigo)", lineHeight: 0.9, letterSpacing: "-0.03em" }}>{s.v}</div>
                  <div style={{ fontSize: 15, color: "var(--text)", marginTop: 10, fontWeight: 600 }}>{t(s.k)}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", overflow: "visible" }}>
            <canvas id="globe" width="680" height="680" style={{ width: "128%", maxWidth: "none", height: "auto", marginRight: "-28%" }} />
          </div>
        </div>
        <style>{`.statsgrid{ overflow:hidden; }`}</style>
        <style>{`@media(max-width:880px){ .statsgrid{ grid-template-columns:1fr !important; gap:50px !important; } .statsgrid > div:last-child{ order:-1; } }`}</style>
      </section>

      {/* AGENT VIDEO */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 24px 0" }}>
        <div className="agentvid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 12 }}>{t("home.agent.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", margin: "0 0 16px", lineHeight: 1.1 }}>{t("home.agent.title")}</h2>
            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, maxWidth: 440 }}>{t("home.agent.text")}</p>
          </div>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", aspectRatio: "16/10", background: "var(--surface-2)" }}>
            <video controls poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&q=80" style={{ width: "100%", height: "100%", objectFit: "cover" }}>
              <source src="https://cdn.coverr.co/videos/coverr-a-woman-in-a-business-meeting-5244/1080p.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* FEATURED — журнальная мозаика */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0" }}>
        <div  style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 8 }}>{t("home.featured.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", margin: 0 }}>{t("home.featured.title")}</h2>
          </div>
          <Link href="/search" style={{ color: "var(--text)", fontSize: 14, textDecoration: "none", opacity: 0.8 }}>{t("home.viewall")}</Link>
        </div>
        <div className="mosaic">
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
        <Link href="/investors"  style={{ display: "block", textDecoration: "none", position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 340 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1565402170291-8491f14678db?w=1800&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(255,255,255,.92) 0%,rgba(22,18,28,.7) 50%,rgba(22,18,28,.35) 100%)" }} />
          <div style={{ position: "relative", padding: "48px 40px", maxWidth: 600 }}>
            <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 14 }}>{t("home.inv.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", margin: "0 0 16px", lineHeight: 1.06, color: "var(--text)" }}>{t("home.inv.title")}</h2>
            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, maxWidth: 460, margin: "0 0 24px" }}>
              {t("home.inv.text")}
            </p>
            <span className="btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--coral)", color: "#fff", padding: "13px 26px", borderRadius: 999, fontSize: 15, fontWeight: 500 }}>{t("home.inv.cta")}</span>
          </div>
        </Link>
      </section>

      {/* CALC + CONSULT */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "none", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 8 }}>{t("home.calc.eyebrow")}</div>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", margin: "0 0 16px" }}>{t("home.calc.title")}</h2>
          <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>{t("home.calc.text")}</p>
        </div>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <MortgageCalculator price={750000} editablePrice />
        </div>
      </section>

      <section style={{ background: "var(--indigo)", padding: "72px 24px 80px", marginTop: 80 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", margin: 0, color: "#fff" }}>{t("home.consult.title")}</h2>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 16, marginTop: 10 }}>{t("home.consult.text")}</p>
        </div>
        <div className="consult-split" style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* запись через Calendly — на индиго-фоне, без рамки */}
          <div style={{ height: 700, borderRadius: 16, overflow: "hidden" }}>
            <iframe src={`${AGENT.calendly}?embed_domain=promiamirealty.com&embed_type=Inline&hide_gdpr_banner=1&background_color=2e1a4a&text_color=f6f1ec&primary_color=f5a623`} width="100%" height="100%" frameBorder="0" title="Book" style={{ display: "block", border: "none" }} />
          </div>
        </div>
      </section>

      <AIChat />
      <style>{`
        .mosaic{ display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:150px; gap:12px; }
        .m-big{ grid-column:span 2; grid-row:span 2; }
        .tile{ position:relative; border-radius:14px; overflow:hidden; text-decoration:none; display:block; background:var(--surface-2); }
        .tile-img{ position:absolute; inset:0; background-size:cover; background-position:center; transition:transform .5s cubic-bezier(.2,.7,.2,1); }
        .tile:hover .tile-img{ transform:scale(1.06); }
        .tile-ov{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(22,18,28,0) 45%,rgba(22,18,28,.9) 100%); }
        .tile-badge{ position:absolute; top:12px; left:12px; background:rgba(242,116,44,.92); color:#fff; font-size:11px; font-weight:500; padding:4px 10px; border-radius:999px; }
        .tile-info{ position:absolute; bottom:0; left:0; right:0; padding:14px; }
        .tile-price{ color:#fff; font-size:17px; font-weight:500; font-family:'Space Grotesk',serif; }
        .tile-addr{ color:rgba(255,255,255,.82); font-size:12px; margin-top:2px; }
        .tile-specs{ color:rgba(255,255,255,.7); font-size:12px; margin-top:4px; }
        @media (max-width:760px){ .mosaic{ grid-template-columns:repeat(2,1fr); } .m-big{ grid-column:span 2; grid-row:span 1; } .agentvid{ grid-template-columns:1fr !important; } .consult-split{ grid-template-columns:1fr !important; } }
      `}</style>
    </>
  );
}
