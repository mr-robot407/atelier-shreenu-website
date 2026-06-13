"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

const HERO_IMAGES = [
  "/images/hero2/1.jpg",
  "/images/hero2/2.jpg",
  "/images/hero2/3.jpg",
  "/images/hero2/4.jpg",
  "/images/hero2/5.jpg",
  "/images/hero2/6.jpg",
];

const INTERVAL = 2750;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [zoomKeys, setZoomKeys] = useState<number[]>(() =>
    HERO_IMAGES.map((_, i) => (i === 0 ? 1 : 0))
  );
  const isFirstRender = useRef(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setZoomKeys((keys) => keys.map((k, i) => (i === current ? k + 1 : k)));
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const handleDot = (i: number) => setCurrent(i);

  const crossfadeDuration = reducedMotion ? "duration-0" : "duration-[1200ms]";

  return (
    <section id="main-content" className="relative min-h-dvh w-full overflow-hidden bg-warm-ivory">

      {/* Screen-reader carousel announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Image {current + 1} of {HERO_IMAGES.length}
      </div>

      {/* ── MOBILE: soft-tinted full-bleed background ── */}
      <div className="absolute inset-0 md:hidden">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
            className={`absolute inset-0 transition-opacity ${crossfadeDuration} ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Interior view ${i + 1}`}
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-warm-ivory/80" />
        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 65%, rgba(20,14,10,0.24) 100%)" }}
        />
      </div>

      {/* ── Content (both breakpoints) ── */}
      <div className="relative z-10 grid min-h-dvh md:grid-cols-2">

        <div className="flex flex-col px-6 pb-10 pt-0 md:px-20 md:pb-[2.5rem]">
          {/* Label — desktop only, sits at carousel-top height via pt-[9rem] */}
          <div className="hidden md:block" style={{ paddingTop: "9rem" }}>
            <FadeIn>
              <div className="mb-4 flex items-center gap-3 text-micro text-burgundy">
                <span>ATELIER SHREENU</span>
                <span>·</span>
                <span>EST. 2025</span>
              </div>
              <div className="text-xs font-sans font-light tracking-[0.06em] text-charcoal/65">
                by The Vrindavan Project · Est. 2012
              </div>
            </FadeIn>
          </div>

          {/* Watermark behind h1 — centred vertically in the column */}
          {/* Font: Desirable Calligraphy — place /public/fonts/DesirableCalligraphy.woff2 to activate */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -z-0 select-none leading-none text-charcoal/[0.04]"
            style={{ fontSize: "clamp(140px, 18vw, 240px)", fontFamily: "'Desirable Calligraphy', var(--font-cormorant), Georgia, serif" }}
          >
            Atelier
            <br />
            Shreenu
          </div>

          {/* Equal spacer — pushes h1 to vertical centre */}
          <div className="flex-1 hidden md:block" />

          {/* MIDDLE — h1 floats centred between label and bottom group */}
          <FadeIn className="relative pt-32 md:pt-0">
            <h1 className="font-serif text-[56px] leading-[1.04] tracking-tight md:text-[96px]">
              Design for those
              <br />
              who live with{" "}
              <span className="italic">intention.</span>
            </h1>
          </FadeIn>

          {/* Equal spacer — separates h1 from bottom group */}
          <div className="flex-1 hidden md:block" />

          {/* BOTTOM — description + buttons pinned to carousel bottom */}
          <FadeIn delay={0.15}>
            <p className="max-w-md text-base leading-relaxed text-charcoal/75 md:text-lg">
              Architecture and interiors rooted in place, by Shreenu & Ranjeet Mukherjee,
              practising across India since 2012.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-6 flex items-center gap-8">
            <a
              href="#work"
              className="inline-flex min-h-[44px] items-center text-micro border border-charcoal/60 px-7 transition-all duration-200 hover:bg-burgundy hover:border-burgundy hover:text-warm-ivory"
            >
              See the work
            </a>
            <a
              href="#approach"
              style={{ touchAction: "manipulation" }}
              className="inline-flex min-h-[44px] items-center text-micro border-b border-charcoal/40 pb-1 transition-all hover:border-burgundy"
            >
              Our approach
            </a>
          </FadeIn>
        </div>

        {/* ── DESKTOP: framed carousel — right grid column ── */}
        <div
          className="hidden md:block"
          style={{ padding: "9rem 2.5rem 2.5rem 3rem" }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-charcoal/20 shadow-[0_4px_40px_-8px_rgba(28,28,28,0.12)]">
            {HERO_IMAGES.map((src, i) => (
              <div
                key={src}
                style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
                className={`absolute inset-0 transition-opacity ${crossfadeDuration} ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  key={`zoom-${i}-${zoomKeys[i]}`}
                  className={reducedMotion ? "absolute inset-0" : "absolute inset-0 animate-ken-burns"}
                >
                  <Image
                    src={src}
                    alt={`Interior view ${i + 1}`}
                    fill
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              </div>
            ))}

            {/* vignette */}
            <div
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{ background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 60%, rgba(20,14,10,0.28) 100%)" }}
            />

            {/* slide counter — top-right inside frame */}
            <div className="absolute right-5 top-4 z-10 font-sans text-[10px] tracking-widest text-warm-ivory/60 uppercase" aria-hidden="true">
              {String(current + 1).padStart(2, "0")} / {String(HERO_IMAGES.length).padStart(2, "0")}
            </div>

            {/* dash indicators — bottom-centre inside frame */}
            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1" role="tablist" aria-label="Carousel slides">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => handleDot(i)}
                  style={{ touchAction: "manipulation" }}
                  className="flex min-h-[44px] min-w-[20px] items-center justify-center"
                >
                  <span
                    className={`block h-[1.5px] transition-all duration-500 ${
                      i === current
                        ? "w-8 bg-warm-ivory"
                        : "w-3 bg-warm-ivory/40 hover:bg-warm-ivory/70"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
