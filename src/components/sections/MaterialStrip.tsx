"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const frames = [
  { src: "/images/texture/material.jpg", alt: "Material", label: "Material" },
  { src: "/images/texture/water.jpg", alt: "Water", label: "Water" },
  { src: "/images/texture/geometry.jpg", alt: "Geometry", label: "Geometry" },
  { src: "/images/texture/light.jpg", alt: "Light", label: "Light" },
  { src: "/images/texture/luxury.jpg", alt: "Luxury", label: "Luxury" },
  { src: "/images/texture/vertical.jpg", alt: "Vertical", label: "Vertical" },
  { src: "/images/texture/craft.jpg", alt: "Craft", label: "Craft" },
  { src: "/images/texture/texture.jpg", alt: "Texture", label: "Texture" },
  { src: "/images/texture/structure.jpg", alt: "Structure", label: "Structure" },
];

const loop = [...frames, ...frames];
const SPEED = 0.0635; // px per ms ≈ 63.5 px/s (+5% for 9 frames)

export function MaterialStrip() {
  const x = useMotionValue(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const jumpingRef = useRef(false);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>();

  const getHalfWidth = () =>
    stripRef.current ? stripRef.current.scrollWidth / 2 : 0;

  const getStride = () => {
    if (!stripRef.current) return 0;
    const items = stripRef.current.children;
    if (items.length < 2) return 0;
    return (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft;
  };

  const tick = (time: number) => {
    if (lastTimeRef.current && !pausedRef.current && !jumpingRef.current) {
      const delta = time - lastTimeRef.current;
      const halfWidth = getHalfWidth();
      if (halfWidth > 0) {
        let next = x.get() - SPEED * delta;
        if (Math.abs(next) >= halfWidth) next += halfWidth;
        x.set(next);
      }
    }
    lastTimeRef.current = time;
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Reset timer delta on tab re-focus to avoid position jump
  useEffect(() => {
    const onVisibility = () => { if (!document.hidden) lastTimeRef.current = 0; };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const jumpTo = (target: number) => {
    jumpingRef.current = true;
    animate(x, target, {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => { jumpingRef.current = false; },
    });
  };

  const jumpNext = () => {
    const stride = getStride();
    const halfWidth = getHalfWidth();
    if (!stride || !halfWidth) return;
    const curr = Math.abs(x.get());
    const snap = (Math.floor(curr / stride) + 1) * stride;
    jumpTo(-(snap >= halfWidth ? snap - halfWidth : snap));
  };

  const jumpPrev = () => {
    const stride = getStride();
    if (!stride) return;
    const curr = Math.abs(x.get());
    const snap = Math.max(0, (Math.ceil(curr / stride) - 1) * stride);
    jumpTo(-snap);
  };

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <section className="overflow-hidden bg-ink py-20 text-bone md:py-28">

      <FadeIn className="px-6 md:px-20 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-bone/40" />
          <span className="text-micro text-bone/70">Material &amp; Detail</span>
        </div>
      </FadeIn>

      <div
        className="relative"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className="overflow-hidden">
          <motion.div
            ref={stripRef}
            className="flex gap-3 md:gap-4"
            style={{ x }}
          >
            {loop.map((f, i) => (
              <div
                key={i}
                className="group relative aspect-[3/4] w-[65vw] shrink-0 overflow-hidden md:w-[28vw] lg:w-[22vw]"
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  draggable={false}
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] select-none"
                  sizes="(max-width: 768px) 65vw, 28vw"
                />
                <div className="absolute inset-0 z-[1]" aria-hidden="true" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] bg-gradient-to-t from-ink/70 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="text-micro text-bone">{f.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent z-10" />

        {/* Prev */}
        <button
          onClick={jumpPrev}
          onMouseEnter={pause}
          onMouseLeave={resume}
          aria-label="Previous frame"
          style={{ touchAction: "manipulation" }}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center border border-bone/40 text-bone transition-all duration-200 hover:bg-burgundy hover:border-burgundy focus:outline-none md:left-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Next */}
        <button
          onClick={jumpNext}
          onMouseEnter={pause}
          onMouseLeave={resume}
          aria-label="Next frame"
          style={{ touchAction: "manipulation" }}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 cursor-pointer items-center justify-center border border-bone/40 text-bone transition-all duration-200 hover:bg-burgundy hover:border-burgundy focus:outline-none md:right-8"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
