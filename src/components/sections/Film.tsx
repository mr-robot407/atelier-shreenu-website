"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

const FILMS = [
  { id: "Sb0wXYPINFY", title: "The Vrindavan Project — Studio Film" },
  { id: "NGTnmmrGiIM", title: "Atelier Shreenu — A Home Considered" },
  { id: "WP1i5JgiveE", title: "Atelier Shreenu — Process" },
  { id: "FIWUjKLDFL8", title: "Atelier Shreenu — Material & Making" },
];

export function Film() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);

  const go = (next: number, dir: 1 | -1) => {
    setDirection(dir);
    setCurrent(next);
  };

  const prev = () => go((current - 1 + FILMS.length) % FILMS.length, -1);
  const next = () => go((current + 1) % FILMS.length, 1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 44) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
  };

  return (
    <section className="bg-ink py-24 text-bone md:py-32">
      <Container>
        <FadeIn className="mb-12 text-center">
          <span className="text-micro text-bone/60">Film</span>
          <h2 className="mt-4 font-serif text-4xl italic md:text-6xl">
            The practice, in motion.
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          {/* Video frame */}
          <div
            className="relative overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-video w-full overflow-hidden border border-parchment/30"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${FILMS[current].id}?rel=0&modestbranding=1`}
                  title={FILMS[current].title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls row */}
          <div className="mt-7 flex items-center justify-between">
            {/* Prev / Next */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                aria-label="Previous video"
                style={{ touchAction: "manipulation" }}
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-bone/30 transition-all duration-200 hover:bg-burgundy hover:border-burgundy hover:text-warm-ivory active:scale-[0.96] focus:outline-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next video"
                style={{ touchAction: "manipulation" }}
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-bone/30 transition-all duration-200 hover:bg-burgundy hover:border-burgundy hover:text-warm-ivory active:scale-[0.96] focus:outline-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Slide counter */}
            <span className="text-micro text-bone/45" aria-live="polite" aria-atomic="true">
              {String(current + 1).padStart(2, "0")} / {String(FILMS.length).padStart(2, "0")}
            </span>

            {/* Dash indicators */}
            <div className="flex gap-1" role="tablist" aria-label="Videos">
              {FILMS.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Video ${i + 1}`}
                  onClick={() => go(i, i > current ? 1 : -1)}
                  style={{ touchAction: "manipulation" }}
                  className="flex min-h-[44px] min-w-[20px] cursor-pointer items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-bone"
                >
                  <span
                    className={`block h-px transition-all duration-500 ${
                      i === current ? "w-8 bg-bone" : "w-4 bg-bone/30 hover:bg-bone/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
