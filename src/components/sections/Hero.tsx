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
  "/images/hero2/11.jpg",
  "/images/hero2/44.jpg",
  "/images/hero2/66.jpg",
  "/images/hero2/77.jpg",
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
    <section id="main-content" className="relative min-h-[100svh] w-full overflow-x-hidden bg-warm-ivory">

      {/* Screen-reader carousel announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Image {current + 1} of {HERO_IMAGES.length}
      </div>

      {/* ── Content (both breakpoints) ── */}
      <div className="relative z-10 grid min-h-[100svh] md:grid-cols-2">

        <div className="flex flex-col px-6 pb-10 pt-20 md:pt-0 md:px-20 md:pb-[2.5rem]">
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

          {/* Mobile label — visible below nav clearance */}
          <div className="md:hidden mb-6">
            <FadeIn>
              <div className="mb-2 flex items-center gap-3 text-micro text-burgundy">
                <span>ATELIER SHREENU</span>
                <span>·</span>
                <span>EST. 2025</span>
              </div>
              <div className="text-xs font-sans font-light tracking-[0.06em] text-charcoal/65">
                by The Vrindavan Project · Est. 2012
              </div>
            </FadeIn>
          </div>

          {/* Equal spacer — pushes h1 to vertical centre on desktop */}
          <div className="flex-1 hidden md:block" />

          {/* MIDDLE — h1 floats centred between label and bottom group */}
          <FadeIn className="relative md:pt-0">
            <h1 className="font-serif text-[59px] leading-[1.04] tracking-tight md:text-[99px]">
              Design for those
              <br />
              who live with{" "}
              <span className="italic">intention.</span>
            </h1>
          </FadeIn>

          {/* Spacer — desktop: separates h1 from bottom group; mobile: small fixed gap */}
          <div className="h-6 md:hidden" />
          <div className="flex-1 hidden md:block" />

          {/* BOTTOM — description + buttons */}
          <FadeIn delay={0.15}>
            <p className="max-w-md text-base leading-relaxed text-charcoal/75 md:text-lg">
              Architecture and interiors rooted in place, by Shreenu & Ranjeet Mukherjee,
              practising across India.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-6 flex items-center gap-6">
            <a
              href="#work"
              style={{ touchAction: "manipulation" }}
              className="inline-flex min-h-[44px] items-center text-micro text-charcoal border border-charcoal/60 px-7 rounded-lg
                shadow-[0_1px_4px_rgba(28,20,14,0.10),0_0_0_0.5px_rgba(28,20,14,0.04)]
                transition-all duration-200
                hover:bg-burgundy hover:text-warm-ivory hover:border-burgundy hover:shadow-[0_6px_20px_rgba(125,32,39,0.28),0_2px_6px_rgba(125,32,39,0.14)]
                active:scale-[0.97] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)]"
            >
              See the work
            </a>
            <a
              href="#approach"
              style={{ touchAction: "manipulation" }}
              className="inline-flex min-h-[44px] items-center text-micro text-charcoal/70 border border-charcoal/25 px-7 rounded-lg
                shadow-[0_1px_3px_rgba(28,20,14,0.06)]
                transition-all duration-200
                hover:bg-burgundy hover:text-warm-ivory hover:border-burgundy hover:shadow-[0_6px_20px_rgba(125,32,39,0.28),0_2px_6px_rgba(125,32,39,0.14)]
                active:scale-[0.97] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.18)]"
            >
              Our approach
            </a>
          </FadeIn>

          {/* ── MOBILE only: framed image carousel below buttons ── */}
          <FadeIn delay={0.4} className="mt-8 pb-10 md:hidden">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-charcoal/20 shadow-[0_4px_40px_-8px_rgba(28,28,28,0.12)]">
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
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
              {/* vignette */}
              <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{ background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 60%, rgba(20,14,10,0.28) 100%)" }}
              />
              {/* slide counter — top-right */}
              <div className="absolute right-4 top-4 z-10 font-sans text-[10px] tracking-widest text-warm-ivory/60 uppercase" aria-hidden="true">
                {String(current + 1).padStart(2, "0")} / {String(HERO_IMAGES.length).padStart(2, "0")}
              </div>
              {/* dash indicators — bottom-centre */}
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1" role="tablist" aria-label="Carousel slides">
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
                          : "w-3 bg-warm-ivory/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
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
