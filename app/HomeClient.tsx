"use client";
import Link from "next/link";
import { useEffect } from "react";
import { WORLD_LAND } from "@/lib/worldmap";
import { type Listing, AGENT } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import MortgageCalculator from "@/components/MortgageCalculator";
import BookButton from "@/components/BookButton";
import AIChat from "@/components/AIChat";
import Reveal from "@/components/Reveal";
import ListingCarousel from "@/components/ListingCarousel";

// featured приходит уже с сервера (live MLS или демо-fallback) — без клиентского мерцания.
export default function HomeClient({ featured }: { featured: Listing[] }) {
  const { t } = useLang();

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
      return { px: cx + xs * R, py: cy - ys * R, z: zs, xs, ys };
    };

    // направление света (верх-лево-перёд) — для затенения как у освещённого шара
    const LX = -0.40, LY = 0.52, LZ = 0.76;

    // start rotated so the Americas (Miami) face viewer
    let rot = (80.19 - 45) * Math.PI / 180, raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      rot += 0.0016;
      // все точки сферы; сортируем по z (дальние первыми) — задняя сторона
      // бледно просвечивает «под» передней при вращении (3D-эффект).
      const pts = land.map(p => project(p.lat, p.lon, rot)).sort((a, b) => a.z - b.z);
      for (const { px, py, z, xs, ys } of pts) {
        const front = z >= -0.04;
        // яркость по освещению: насколько точка повёрнута к свету
        const lit = Math.max(0, xs * LX + ys * LY + z * LZ);
        if (front) {
          ctx.fillStyle = `rgba(44,90,80,${0.16 + lit * 0.62})`;
          const r = 0.7 + lit * 0.9;
          ctx.fillRect(px - r, py - r, r * 2, r * 2);
        } else {
          // задняя сторона — еле заметная
          ctx.fillStyle = `rgba(44,90,80,${0.045 + (z + 1) * 0.03})`;
          ctx.fillRect(px - 0.5, py - 0.5, 1, 1);
        }
      }
      // palm emoji marker on Miami — on a glossy white disc (crisp, no transparency)
      const m = project(miami.lat, miami.lon, rot);
      if (m.z > 0.05) {
        const mx = m.px, my = m.py;
        ctx.save();
        // glossy white disc backing
        ctx.beginPath(); ctx.arc(mx, my, 19, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(44,90,80,.75)"; ctx.shadowBlur = 16;
        ctx.fill();
        // thin amber ring
        ctx.beginPath(); ctx.arc(mx, my, 19, 0, Math.PI * 2);
        ctx.lineWidth = 2; ctx.strokeStyle = "#2C5A50"; ctx.shadowBlur = 0; ctx.stroke();
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
        <video className="hero-video" autoPlay muted loop playsInline poster="/hero.png"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-miami-beach-4818/1080p.mp4" type="video/mp4" />
        </video>
        <img className="hero-mobile-img" src="/hero-mobile.jpg" alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,8,16,.35) 0%,rgba(10,8,16,.12) 35%,rgba(10,8,16,.78) 100%)" }} />
        <style>{`.hero-mobile-img{ display:none; } @media(max-width:768px){ .hero-video{ display:none !important; } .hero-mobile-img{ display:block !important; } }`}</style>
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 24px 90px", width: "100%" }}>
          <h1 className="" style={{ fontSize: "clamp(40px,7vw,82px)", lineHeight: 1.02, margin: 0, maxWidth: 900, color: "#fff", textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>{t("home.title")}</h1>
          <p className="" style={{ fontSize: 19, color: "#fff", maxWidth: 580, marginTop: 22, lineHeight: 1.7, textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}>
            {t("home.subtitle")}
          </p>
          <div className="" style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            <Link href="/search" className="btn" style={{ background: "linear-gradient(135deg, #2C5A50 0%, #234A42 100%)", color: "#fff", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 12px 28px -12px rgba(44,90,80,0.7)" }}>{t("home.cta.search")}</Link>
            <BookButton intent="buy" source="Home hero" label={t("home.cta.book")} variant="outline" style={{ background: "rgba(255,255,255,0.16)", color: "#fff", padding: "14px 28px", fontSize: 15, border: "1px solid rgba(255,255,255,0.45)" }} />
          </div>
        </div>
      </section>

      {/* STATS — о компании (SERHANT-style: цифры слева + globe справа) */}
      <section style={{ background: "var(--bg2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="statsgrid" style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 32, alignItems: "center" }}>
          <Reveal>
            <div className="eyebrow">{t("home.stats.eyebrow")}</div>
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
          </Reveal>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", overflow: "visible" }}>
            <canvas id="globe" width="680" height="680" style={{ width: "138%", maxWidth: "none", height: "auto", marginRight: "-22%" }} />
          </div>
        </div>
        <style>{`.statsgrid{ overflow:hidden; }`}</style>
        <style>{`@media(max-width:880px){ .statsgrid{ grid-template-columns:1fr !important; gap:24px !important; padding:44px 24px !important; } .statsgrid > div:last-child{ order:-1; } #globe{ width:88% !important; max-width:460px !important; margin:0 auto !important; margin-right:auto !important; } }`}</style>
      </section>

      {/* AGENT VIDEO — скрыто по просьбе клиента */}

      {/* FEATURED — горизонтальный карусель */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 24px 0" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div className="eyebrow">{t("home.featured.eyebrow")}</div>
              <h2 style={{ fontSize: "clamp(28px,4vw,40px)", margin: 0 }}>{t("home.featured.title")}</h2>
            </div>
            <Link href="/search" className="viewall">{t("home.viewall")} →</Link>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <ListingCarousel listings={featured} />
        </Reveal>
      </section>

      {/* INVESTORS — ключевой блок */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 24px 0" }}>
        <Reveal>
        <Link href="/investors" className="invblock" style={{ display: "block", textDecoration: "none", position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 340 }}>
          <div className="invblock-img" style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=1800&q=80)", backgroundSize: "cover", backgroundPosition: "center", transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(255,255,255,.94) 0%,rgba(244,241,234,.82) 38%,rgba(44,90,80,.35) 100%)" }} />
          <div style={{ position: "relative", padding: "48px 40px", maxWidth: 600 }}>
            <div className="eyebrow">{t("home.inv.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", margin: "0 0 16px", lineHeight: 1.06, color: "var(--text)" }}>{t("home.inv.title")}</h2>
            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, maxWidth: 460, margin: "0 0 24px" }}>
              {t("home.inv.text")}
            </p>
            <span className="btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--coral)", color: "#fff", padding: "13px 26px", borderRadius: 999, fontSize: 15, fontWeight: 600 }}>{t("home.inv.cta")}</span>
          </div>
        </Link>
        </Reveal>
      </section>

      {/* CALC + CONSULT */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 24px 0" }}>
        <Reveal>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>{t("home.calc.eyebrow")}</div>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", margin: "0 0 16px" }}>{t("home.calc.title")}</h2>
          <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>{t("home.calc.text")}</p>
        </div>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <MortgageCalculator price={750000} editablePrice />
        </div>
        </Reveal>
      </section>

      <section style={{ background: "var(--indigo)", padding: "80px 24px 88px", marginTop: 96 }}>
        <Reveal>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", margin: 0, color: "#fff" }}>{t("home.consult.title")}</h2>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 16, marginTop: 10 }}>{t("home.consult.text")}</p>
        </div>
        <div className="consult-split" style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* запись через Calendly — на индиго-фоне, без рамки */}
          <div style={{ height: 700, borderRadius: 16, overflow: "hidden" }}>
            <iframe src={`${AGENT.calendly}?embed_domain=promiamirealty.com&embed_type=Inline&hide_gdpr_banner=1&background_color=2C5A50&text_color=F2EFE6&primary_color=7FB3A7`} width="100%" height="100%" frameBorder="0" title="Book" style={{ display: "block", border: "none" }} />
          </div>
        </div>
        </Reveal>
      </section>

      <AIChat />
      <style>{`
        .invblock:hover .invblock-img{ transform:scale(1.05); }
        @media (max-width:760px){ .consult-split{ grid-template-columns:1fr !important; } }
      `}</style>
    </>
  );
}
