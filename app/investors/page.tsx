"use client";
import Link from "next/link";
import { LISTINGS, AGENT, fmtPrice } from "@/lib/data";
import InvestmentCalculator from "@/components/InvestmentCalculator";

export default function Investors() {
  const deals = LISTINGS.filter(l => l.investor);
  const capProxy = (price: number, rent?: number) => rent ? (((rent * 12 * 0.6) / price) * 100).toFixed(1) : "—";

  const services = [
    ["Find income properties", "Off-market and on-market rentals screened for cash flow — not just what's listed, but what actually pencils out."],
    ["Rental market analysis", "Real rent comps by neighborhood, vacancy trends, and what tenants pay now — so projections hold up."],
    ["Run the numbers together", "Cap rate, cash-on-cash, and monthly cash flow on every deal before you commit a dollar."],
  ];

  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "72vh", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1565402170291-8491f14678db?w=2000&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(22,18,28,.6) 0%,rgba(22,18,28,.4) 40%,rgba(22,18,28,.96) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "0 24px 64px", width: "100%" }}>
          <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 16 }}>For investors</div>
          <h1 style={{ fontSize: "clamp(36px,6vw,68px)", lineHeight: 1.04, margin: 0, maxWidth: 760 }}>Miami real estate that pays you back.</h1>
          <p style={{ fontSize: 18, color: "var(--muted)", maxWidth: 540, marginTop: 20, lineHeight: 1.7 }}>
            Cash-flowing rentals, clear numbers, and on-the-ground market insight — built for investors who buy on returns, not emotion.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
            <a href="#calculator" style={{ background: "var(--coral)", color: "#fff", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Analyze a deal</a>
            <a href="#deals" style={{ background: "rgba(246,241,236,.1)", color: "var(--text)", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none", border: "1px solid var(--line)" }}>See income properties</a>
          </div>
        </div>
      </section>

      {/* SERVICE */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0" }}>
        <h2 style={{ fontSize: "clamp(26px,4vw,40px)", margin: "0 0 8px", maxWidth: 640 }}>What working with an investor-focused agent looks like</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 560, marginTop: 0 }}>Most agents sell homes. The focus here is returns — finding the deal and proving it works before you buy.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 32 }}>
          {services.map(([t, d], i) => (
            <div key={i} style={{ background: "var(--surface)", borderRadius: 16, padding: 26, border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 13, color: "var(--coral)", fontWeight: 500, marginBottom: 12 }}>0{i + 1}</div>
              <div style={{ fontSize: 19, fontFamily: "Fraunces, serif", fontWeight: 500, marginBottom: 10 }}>{t}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0", scrollMarginTop: 90 }}>
        <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 10 }}>Deal analyzer</div>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", margin: "0 0 8px" }}>Run any property's numbers</h2>
        <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 0, marginBottom: 28, maxWidth: 540 }}>Plug in price, rent, and expenses to see cap rate, cash-on-cash return, and monthly cash flow instantly.</p>
        <InvestmentCalculator />
      </section>

      {/* DEALS */}
      <section id="deals" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0", scrollMarginTop: 90 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--coral)", marginBottom: 8 }}>Income properties</div>
            <h2 style={{ fontSize: "clamp(26px,4vw,38px)", margin: 0 }}>Rentals worth a look</h2>
          </div>
          <Link href="/search" style={{ color: "var(--text)", fontSize: 14, textDecoration: "none", opacity: 0.8 }}>All listings →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {deals.map(l => (
            <Link key={l.id} href={`/listings/${l.id}`} style={{ textDecoration: "none", background: "var(--surface)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)", display: "block" }}>
              <div style={{ height: 170, backgroundImage: `url(${l.photos[0]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 20, fontWeight: 500, fontFamily: "Fraunces, serif", color: "var(--text)" }}>{fmtPrice(l.price)}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{l.address}, {l.city}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <div style={{ flex: 1, background: "var(--bg)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Est. rent</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>${l.estRent?.toLocaleString()}/mo</div>
                  </div>
                  <div style={{ flex: 1, background: "var(--bg)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>~Cap rate</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--amber)" }}>{capProxy(l.price, l.estRent)}%</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 16 }}>Cap rate shown is a quick estimate (assumes ~40% operating costs). Run the full analysis above or ask for a detailed pro forma.</p>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ background: "var(--surface)", borderRadius: 20, padding: "44px 32px", textAlign: "center", border: "1px solid var(--line)" }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", margin: "0 0 12px" }}>Looking for your next deal?</h2>
          <p style={{ color: "var(--muted)", fontSize: 16, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>Tell {AGENT.name} your target return and budget — get matched with properties that fit.</p>
          <a href={AGENT.calendly} style={{ background: "var(--coral)", color: "#fff", padding: "14px 30px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Book an investor consultation</a>
        </div>
      </section>
    </div>
  );
}
