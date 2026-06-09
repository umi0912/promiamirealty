import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LangProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "PRO MIAMI REALTY — Miami & Broward Real Estate",
  description: "Buy, sell, and invest in Miami-Dade and Broward real estate with Ays Iziken, PRO MIAMI REALTY. Search live listings, estimate payments, and book a consultation.",
  openGraph: {
    title: "PRO MIAMI REALTY — Miami & Broward Real Estate",
    description: "Search live Miami listings, estimate payments, and connect with a local expert.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "PRO MIAMI REALTY",
    image: "https://promiamirealty.com/og.jpg",
    "@id": "https://promiamirealty.com",
    url: "https://promiamirealty.com",
    telephone: "+13057665513",
    email: "info@promiamirealty.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3350 SW 148 Ave, Suite 110",
      addressLocality: "Miramar",
      addressRegion: "FL",
      postalCode: "33027",
      addressCountry: "US",
    },
    areaServed: ["Miami-Dade County", "Broward County", "South Florida"],
  };
  return (
    <html lang="en">
      <body>
        {/* фоновый sunset-акцент: фиксированные размытые пятна за всем контентом */}
        <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none", transform: "translateZ(0)", willChange: "transform" }}>
          <div style={{ position: "absolute", top: "-200px", left: "-100px", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,116,44,0.08), transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-200px", right: "-100px", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)" }} />
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <LangProvider>
          <Header />
          <main style={{ minHeight: "60vh" }}>{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
