import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2">
        <Image
          src="/images/hero/hero-main.jpg"
          alt="Interior"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-warm-ivory/30 md:hidden" />
      </div>

      <div className="relative z-10 grid min-h-screen md:grid-cols-2">
        <div className="flex flex-col justify-end bg-warm-ivory/95 px-6 pb-20 pt-32 backdrop-blur-sm md:bg-warm-ivory md:px-20 md:pb-24 md:pt-40 md:backdrop-blur-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/3 -z-0 select-none font-serif leading-none text-charcoal/[0.04]"
            style={{ fontSize: "clamp(140px, 18vw, 240px)" }}
          >
            Atelier
            <br />
            Shreenu
          </div>

          <FadeIn className="relative">
            <div className="mb-6 flex items-center gap-3 text-micro text-burgundy">
              <span>ATELIER SHREENU</span>
              <span>—</span>
              <span>EST. 2012</span>
            </div>

            <h1 className="font-serif text-[56px] leading-[1.04] tracking-tight md:text-[96px]">
              Contextual,
              <br />
              <span className="italic">conscious</span> &<br />
              soulful design.
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/75 md:text-lg">
              Architecture and interiors rooted in place — by Ranjeet & Shreenu Mukherjee,
              practising across India since 2012.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-12 flex items-center gap-8 md:mt-16">
            <a
              href="#work"
              className="text-micro border border-charcoal/60 px-7 py-3.5 transition-all duration-500 hover:bg-charcoal hover:text-warm-ivory"
            >
              See the work
            </a>
            <a
              href="#approach"
              className="text-micro border-b border-charcoal/40 pb-1 transition-all hover:border-burgundy"
            >
              Our approach
            </a>
          </FadeIn>
        </div>

        <div className="hidden md:block" />
      </div>
    </section>
  );
}