"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel } from "@/components/ui/SectionHeading";
import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const t = testimonials[index];

  return (
    <section className="bg-warm-ivory py-24 md:py-36">
      <Container>
        <FadeIn className="mb-20">
          <SectionLabel className="block text-ink/40">Voices</SectionLabel>
        </FadeIn>

        {/* Fixed-height area: quote + author name close together */}
        <div className="min-h-[580px] md:min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[28px] leading-[1.35] md:text-[40px]"
            >
              &ldquo;{t.quote}&rdquo;
            </motion.blockquote>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`author-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6"
            >
              <div className="text-micro text-burgundy">{t.author}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons — fixed below the longest quote, standalone */}
        <div className="mt-8 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              style={{ touchAction: "manipulation" }}
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/30
                shadow-[0_1px_3px_rgba(28,20,14,0.10),0_0_0_0.5px_rgba(28,20,14,0.04)]
                transition-all duration-200
                hover:bg-burgundy hover:border-burgundy hover:text-warm-ivory hover:shadow-[0_4px_14px_rgba(125,32,39,0.26)]
                active:scale-[0.96] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]
                focus:outline-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="mx-3 flex gap-1" role="tablist" aria-label="Testimonials">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-label={`Testimonial ${i + 1}`}
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  style={{ touchAction: "manipulation" }}
                  className="flex h-11 w-8 cursor-pointer items-center justify-center focus:outline-none"
                >
                  <span className={`block h-px transition-all duration-500 ${
                    i === index ? "w-8 bg-ink" : "w-4 bg-ink/30"
                  }`} />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              style={{ touchAction: "manipulation" }}
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/30
                shadow-[0_1px_3px_rgba(28,20,14,0.10),0_0_0_0.5px_rgba(28,20,14,0.04)]
                transition-all duration-200
                hover:bg-burgundy hover:border-burgundy hover:text-warm-ivory hover:shadow-[0_4px_14px_rgba(125,32,39,0.26)]
                active:scale-[0.96] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]
                focus:outline-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
        </div>
      </Container>
    </section>
  );
}
