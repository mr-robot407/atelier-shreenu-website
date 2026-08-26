import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Approach } from "@/components/sections/Approach";
import { MaterialStrip } from "@/components/sections/MaterialStrip";
import { UniqueQualities } from "@/components/sections/UniqueQualities";
import { Film } from "@/components/sections/Film";
import { Testimonials } from "@/components/sections/Testimonials";
import { Press } from "@/components/sections/Press";
import { FoundersNote } from "@/components/sections/FoundersNote";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Philosophy />
        <SelectedWork />
        <Approach />
        <MaterialStrip />
        <UniqueQualities />
        <Film />
        <Testimonials />
        <FoundersNote />
        <Press />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FaqJsonLd />
    </>
  );
}
