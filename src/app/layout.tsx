import type { Metadata } from "next";
import { serif, sans } from "@/styles/fonts";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ateliershreenu.com"),
  title: {
    default: "Atelier Shreenu — Architecture & Interior Design | by The Vrindavan Project",
    template: "%s · Atelier Shreenu",
  },
  description:
    "Architecture and interior design studio based in Gurugram, specialising in residential, hospitality, and ecologically sensitive design across India. By Ranjeet & Shreenu Mukherjee.",
  keywords: [
    "architecture firm Gurugram",
    "interior designer Delhi NCR",
    "luxury farmhouse design India",
    "sustainable architect",
    "residential architect Gurgaon",
    "Ranjeet Mukherjee architect",
    "Shreenu Mukherjee interior designer",
    "Atelier Shreenu",
  ],
  authors: [{ name: "Atelier Shreenu" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ateliershreenu.com",
    siteName: "Atelier Shreenu",
    title: "Atelier Shreenu — Architecture and Interior Design",
    description:
      "Design for those who live with intention. Architecture and interiors rooted in place, by Shreenu & Ranjeet Mukherjee.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Atelier Shreenu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atelier Shreenu",
    description:
      "Design for those who live with intention. Architecture and interiors rooted in place, by Shreenu & Ranjeet Mukherjee.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-beige.jpg", sizes: "any" },
    ],
    apple: "/favicon-beige.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className={`${serif.variable} ${sans.variable} font-sans antialiased`}>
        {children}
        <WhatsAppButton />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GN7NVMP4TN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GN7NVMP4TN');
          `}
        </Script>
        {/* Structured data: Architect / LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Architect", "LocalBusiness"],
              name: "Atelier Shreenu",
              url: "https://ateliershreenu.com",
              telephone: "+91-95602-06195",
              email: "info@ateliershreenu.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Palam Vihar",
                addressLocality: "Gurugram",
                addressRegion: "Haryana",
                postalCode: "122017",
                addressCountry: "IN",
              },
              founder: [
                { "@type": "Person", name: "Ranjeet Mukherjee" },
                { "@type": "Person", name: "Shreenu Mukherjee" },
              ],
              sameAs: [
                "https://www.instagram.com/ateliershreenu",
                "https://www.youtube.com/@AtelierShreenu",
                "https://www.linkedin.com/company/atelier-shreenu/",
                "https://www.facebook.com/share/1DUhNAnMMQ/",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}