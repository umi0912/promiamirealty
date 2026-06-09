"use client";
import Link from "next/link";
import { LISTINGS, AGENT, fmtPrice } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import MortgageCalculator from "@/components/MortgageCalculator";
import AIChat from "@/components/AIChat";
import ChatPanel from "@/components/ChatPanel";

export default function Home() {
  const { t } = useLang();
  const featured = LISTINGS.filter(l => l.featured);
  const rest = LISTINGS.filter(l => !l.featured).slice(0, 4);
  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=2000&q=80"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-miami-beach-4818/1080p.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(22,18,28,.55) 0%,rgba(22,18,28,.3) 40%,rgba(22,18,28,.95) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px", width: "100%" }}>
          <div  style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 18 }}>{t("home.eyebrow")}</div>
          <h1 className="" style={{ fontSize: "clamp(40px,7vw,82px)", lineHeight: 1.02, margin: 0, maxWidth: 900 }}>{t("home.title")}</h1>
          <p className="" style={{ fontSize: 18, color: "var(--muted)", maxWidth: 520, marginTop: 24, lineHeight: 1.7 }}>
            {t("home.subtitle")}
          </p>
          <div className="" style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            <Link href="/search" className="btn" style={{ background: "var(--coral)", color: "#fff", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>{t("home.cta.search")}</Link>
            <a href={AGENT.calendly} className="btn" style={{ background: "rgba(246,241,236,.1)", color: "var(--text)", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none", border: "1px solid var(--line)" }}>{t("home.cta.book")}</a>
          </div>
        </div>
      </section>

      {/* STATS — о компании */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 24px 0" }}>
        <div  style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 10 }}>{t("home.stats.eyebrow")}</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", margin: 0 }}>{t("home.stats.title")}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
          {[
            { v: "120+", k: "home.stats.deals" as const, c: "var(--coral)" },
            { v: "$85M+", k: "home.stats.volume" as const, c: "var(--amber)" },
            { v: "6", k: "home.stats.cities" as const, c: "var(--green)" },
            { v: "3", k: "home.stats.langs" as const, c: "var(--violet)" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--surface)", borderRadius: 16, padding: "28px 20px", textAlign: "center", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 38, fontWeight: 500, fontFamily: "Fraunces, serif", color: s.c, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10 }}>{t(s.k)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AGENT VIDEO */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 24px 0" }}>
        <div className="agentvid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 12 }}>{t("home.agent.eyebrow")}</div>
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
            <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 8 }}>{t("home.featured.eyebrow")}</div>
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
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(22,18,28,.92) 0%,rgba(22,18,28,.7) 50%,rgba(22,18,28,.35) 100%)" }} />
          <div style={{ position: "relative", padding: "48px 40px", maxWidth: 600 }}>
            <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 14 }}>{t("home.inv.eyebrow")}</div>
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
        <div  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 8 }}>{t("home.calc.eyebrow")}</div>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", margin: "0 0 16px" }}>{t("home.calc.title")}</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 420 }}>{t("home.calc.text")}</p>
          </div>
          <MortgageCalculator price={750000} />
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", margin: 0 }}>{t("home.consult.title")}</h2>
          <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 10 }}>{t("home.consult.text")}</p>
        </div>
        <div className="consult-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "stretch" }}>
          {/* слева: чат с AI-помощником */}
          <ChatPanel height={600} />
          {/* справа: запись через Calendly */}
          <div style={{ height: 600, borderRadius: 16, border: "1px solid var(--line)", overflow: "hidden" }}>
            <iframe src={`${AGENT.calendly}?hide_gdpr_banner=1&background_color=211b2b&text_color=f6f1ec&primary_color=f2742c`} width="100%" height="100%" frameBorder="0" title="Book" style={{ display: "block", border: "none" }} />
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
        .tile-price{ color:#fff; font-size:17px; font-weight:500; font-family:'Fraunces',serif; }
        .tile-addr{ color:rgba(255,255,255,.82); font-size:12px; margin-top:2px; }
        .tile-specs{ color:rgba(255,255,255,.7); font-size:12px; margin-top:4px; }
        @media (max-width:760px){ .mosaic{ grid-template-columns:repeat(2,1fr); } .m-big{ grid-column:span 2; grid-row:span 1; } .agentvid{ grid-template-columns:1fr !important; } .consult-split{ grid-template-columns:1fr !important; } }
      `}</style>
    </>
  );
}
