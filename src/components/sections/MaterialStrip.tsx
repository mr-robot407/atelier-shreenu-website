"use client";

import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

// Frame order: MATERIAL → LIGHT → TEXTURE → CRAFT → STRUCTURE
// TODO: Replace TEXTURE frame src with new TEXTURE image (asset pending from client)
// TODO: Replace STRUCTURE frame src with new STRUCTURE image (asset pending from client)
const textures = [
  { src: "/images/texture/01.jpg", alt: "Material, weathered wood detail", label: "Material" },
  { src: "/images/texture/02.jpg", alt: "Light, morning through a courtyard", label: "Light" },
  { src: "/images/texture/04.jpg", alt: "Texture, handwoven linen", label: "Texture" },
  { src: "/images/texture/03.jpg", alt: "Craft, hand-finished ceramic", label: "Craft" },
  { src: "/images/texture/05.jpg", alt: "Structure, stone and shadow", label: "Structure" },
];

// Animation duration reduced from 45s → 30s (approximately 0.3s per frame faster at 10 virtual frames)
const SCROLL_DURATION = 30;

export function MaterialStrip() {
  const [paused, setPaused] = useState(false);
  const controls = useAnimationControls();
  const loop = [...textures, ...textures];

  const handlePrev = () => {
    setPaused(true);
    controls.stop();
  };

  const handleNext = () => {
    setPaused(false);
    controls.start({
      x: ["0%", "-50%"],
      transition: { duration: SCROLL_DURATION, ease: "linear", repeat: Infinity },
    });
  };

  return (
    <section className="overflow-hidden bg-ink py-20 text-bone md:py-28">
      <Container>
        <FadeIn>
          <div className="mb-12 flex items-center gap-4">
            <div className="h-px w-12 bg-bone/40" />
            <span className="text-micro text-bone/70">Material &amp; Detail</span>
          </div>
        </FadeIn>
      </Container>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex gap-3 md:gap-4"
          animate={paused ? { x: undefined } : { x: ["0%", "-50%"] }}
          transition={{
            duration: SCROLL_DURATION,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {loop.map((t, i) => (
            <div
              key={i}
              className="group relative aspect-[3/4] w-[65vw] shrink-0 overflow-hidden md:w-[28vw] lg:w-[22vw]"
            >
              <Image
                src={t.src}
                alt={t.alt}
                fill
                draggable={false}
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] select-none"
                sizes="(max-width: 768px) 65vw, 28vw"
              />
              {/* Transparent overlay — prevents browser image-search UI from appearing */}
              <div className="absolute inset-0 z-[1]" aria-hidden="true" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] bg-gradient-to-t from-ink/70 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="text-micro text-bone">{t.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Soft fade at edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent z-10" />

        {/* Prev button — left side */}
        <button
          onClick={handlePrev}
          aria-label="Pause and view previous frame"
          style={{ touchAction: "manipulation" }}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center border border-bone/30 text-bone transition-colors duration-200 hover:bg-bone hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-bone md:left-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Next button — right side */}
        <button
          onClick={handleNext}
          aria-label="Resume scrolling to next frame"
          style={{ touchAction: "manipulation" }}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center border border-bone/30 text-bone transition-colors duration-200 hover:bg-bone hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-bone md:right-8"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
