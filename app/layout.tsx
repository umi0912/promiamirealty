import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LangProvider } from "@/lib/i18n";
import { LeadProvider } from "@/components/LeadModal";

export const metadata: Metadata = {
  title: "PRO MIAMI REALTY — Miami & Broward Real Estate",
  description: "Buy, sell, and invest in Miami-Dade and Broward real estate with Ays Iziken, PRO MIAMI REALTY. Search live listings, estimate payments, and book a consultation.",
  openGraph: {
    title: "PRO MIAMI REALTY — Miami & Broward Real Estate",
    description: "Search live Miami listings, estimate payments, and connect with a local expert.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <LangProvider>
          <LeadProvider>
            <Header />
            <main style={{ minHeight: "60vh" }}>{children}</main>
            <Footer />
          </LeadProvider>
        </LangProvider>
      </body>
    </html>
  );
}
