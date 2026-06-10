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
        <FadeIn className="mb-14">
          <SectionLabel className="block">Voices</SectionLabel>
        </FadeIn>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
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

            <div className="mt-12 flex items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`author-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-micro text-ink">{t.author}</div>
                  {t.role && (
                    <div className="mt-1 text-sm text-ink/55">{t.role}</div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous testimonial"
                  style={{ touchAction: "manipulation" }}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/30 transition-colors hover:bg-ink hover:text-bone focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/50 focus-visible:ring-offset-2"
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
                      className="flex min-h-[44px] min-w-[20px] cursor-pointer items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-ink/50"
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
                  className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ink/30 transition-colors hover:bg-ink hover:text-bone focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/50 focus-visible:ring-offset-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
