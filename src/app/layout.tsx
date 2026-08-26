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
  alternates: {
    canonical: "/",
  },
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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-THQH822B');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className={`${serif.variable} ${sans.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-THQH822B"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
        {/* LinkedIn Insight Tag */}
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "9880252";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript"; b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=9880252&fmt=gif"
          />
        </noscript>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1078519821811648');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1078519821811648&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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