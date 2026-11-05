import { faqs } from "@/content/faqs";

export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ateliershreenu.com/#webpage",
        url: "https://ateliershreenu.com/",
        name: "Atelier Shreenu by The Vrindavan Project | Interior Design and Architecture",
        isPartOf: { "@id": "https://ateliershreenu.com/#website" },
        about: { "@id": "https://ateliershreenu.com/#organization" },
        publisher: { "@id": "https://ateliershreenu.com/#organization" },
        inLanguage: "en-IN",
      },
      {
        "@type": "FAQPage",
        "@id": "https://ateliershreenu.com/#faq",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
