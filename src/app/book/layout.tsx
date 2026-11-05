import type { Metadata } from "next";

const title = "Book a Discovery Call — Atelier Shreenu";
const description =
  "Book a complimentary Discovery Call, a paid Project Discussion, or a Site Walkthrough with Atelier Shreenu. The studio's first step for new enquiries.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/book/" },
  openGraph: {
    type: "website",
    url: "https://ateliershreenu.com/book/",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
