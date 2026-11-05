const SITEWIDE_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ateliershreenu.com/#website",
      url: "https://ateliershreenu.com/",
      name: "Atelier Shreenu",
      alternateName: [
        "Atelier Shreenu by The Vrindavan Project",
        "The Vrindavan Project",
      ],
      inLanguage: "en-IN",
      publisher: { "@id": "https://ateliershreenu.com/#organization" },
    },
    {
      "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
      "@id": "https://ateliershreenu.com/#organization",
      name: "Atelier Shreenu",
      alternateName: [
        "Atelier Shreenu by The Vrindavan Project",
        "The Vrindavan Project",
      ],
      legalName: "Shreenu and Ranjeet Design LLP",
      url: "https://ateliershreenu.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://ateliershreenu.com/Shreenu%20logo%20maroon.jpeg",
      },
      image: "https://ateliershreenu.com/og-image.jpg",
      description:
        "Founder-led luxury residential architecture and interiors practice in Palam Vihar, Gurugram, working across India on homes, farmhouses and villas. Quiet luxury shaped by material craft and design clarity. Atelier Shreenu (est. 2025), formerly The Vrindavan Project (est. 2012) by architect Ranjeet Mukherjee and interior designer Shreenu Mukherjee.",
      slogan: "Design for those who live with intention.",
      foundingDate: "2012",
      email: "info@ateliershreenu.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Celebrity Homes, Palam Vihar",
        addressLocality: "Gurugram",
        addressRegion: "Haryana",
        postalCode: "122017",
        addressCountry: "IN",
      },
      hasMap: "https://maps.app.goo.gl/r5N5uGP7yKWBGSdh7",
      areaServed: [
        { "@type": "City", name: "Gurugram" },
        { "@type": "AdministrativeArea", name: "Delhi NCR" },
        { "@type": "AdministrativeArea", name: "Hill states of northern India" },
      ],
      knowsAbout: [
        "Luxury residential architecture",
        "Luxury interior design",
        "Quiet luxury residences",
        "Material craft and provenance",
        "Farmhouse and villa design",
      ],
      founder: [
        { "@id": "https://ateliershreenu.com/#ranjeet" },
        { "@id": "https://ateliershreenu.com/#shreenu" },
      ],
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Luxury residential architecture consultancy",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Luxury interior design consultancy",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Integrated architecture and interior design for homes, farmhouses and villas",
          },
        },
      ],
      subjectOf: [
        {
          "@type": "Article",
          url: "https://elledecor.in/jammu-home-by-the-vrindavan-project/",
          publisher: { "@type": "Organization", name: "ELLE DECOR India" },
        },
        {
          "@type": "Article",
          url: "https://www.architecturaldigest.in/story/this-5000-square-foot-farmhouse-in-delhi-is-a-tapestry-of-jewel-tones/",
          datePublished: "2024-10-21",
          publisher: {
            "@type": "Organization",
            name: "Architectural Digest India",
          },
        },
        {
          "@type": "Article",
          url: "https://www.indiatoday.in/magazine/supplement/story/20241223-interior-design-simple-living-2648254-2024-12-13",
          publisher: { "@type": "Organization", name: "India Today" },
        },
        {
          "@type": "Article",
          url: "https://www.habitusliving.com/projects/atelier-shreenu",
          publisher: { "@type": "Organization", name: "Habitus Living" },
        },
        {
          "@type": "Article",
          url: "https://www.archdaily.com/975260/entheogenic-house-the-vrindavan-project",
          publisher: { "@type": "Organization", name: "ArchDaily" },
        },
      ],
      sameAs: [
        "https://www.instagram.com/ateliershreenu",
        "https://www.youtube.com/@AtelierShreenu",
        "https://www.linkedin.com/company/atelier-shreenu/",
        "https://www.facebook.com/profile.php?id=61593321457827",
        "https://maps.app.goo.gl/r5N5uGP7yKWBGSdh7",
      ],
      potentialAction: {
        "@type": "ReserveAction",
        name: "Book a Discovery Call",
        target: "https://ateliershreenu.com/book/",
      },
    },
    {
      "@type": "Person",
      "@id": "https://ateliershreenu.com/#ranjeet",
      name: "Ranjeet Mukherjee",
      jobTitle: "Co-founder and Architect",
      worksFor: { "@id": "https://ateliershreenu.com/#organization" },
      url: "https://ateliershreenu.com/blog/shreenu-and-ranjeet-mukherjee/",
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional registration",
        name: "Council of Architecture registration CA/2009/44099",
        recognizedBy: {
          "@type": "Organization",
          name: "Council of Architecture, India",
        },
      },
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "CEPT University, Faculty of Architecture, Ahmedabad",
        },
        {
          "@type": "EducationalOrganization",
          name: "The Doon School, Dehradun",
        },
      ],
      sameAs: [
        "https://www.linkedin.com/in/ranjeet-mukherjee-7a151390",
        "https://www.instagram.com/ranjeetmukherjee",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://ateliershreenu.com/#shreenu",
      name: "Shreenu Mukherjee",
      jobTitle: "Co-founder & Interior Designer",
      worksFor: { "@id": "https://ateliershreenu.com/#organization" },
      url: "https://ateliershreenu.com/blog/shreenu-mukherjee-interior-designer-and-co-founder-of-atelier-shreenu/",
      sameAs: [
        "https://www.linkedin.com/in/shreenu-mukherjee-055b1b2b",
        "https://www.instagram.com/shreenu.mukherjee",
      ],
    },
  ],
};

export function OrgJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SITEWIDE_GRAPH) }}
    />
  );
}
