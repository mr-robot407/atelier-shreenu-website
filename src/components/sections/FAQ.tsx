"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { faqs } from "@/content/faqs";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-ink/10 py-20 md:py-28">
      <Container>
        <FadeIn>
          <h2
            className="font-sans font-medium uppercase tracking-widest text-ink/40 mb-12"
            style={{ fontSize: "20px" }}
          >
            FAQ
          </h2>

          <div>
            {faqs.map((item, i) => (
              <div key={i} className="border-t border-ink/10 first:border-t-0">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="group flex w-full items-start justify-between gap-6 py-6 text-left focus:outline-none"
                >
                  <span className="font-serif text-[18px] md:text-[20px] leading-snug text-ink group-hover:text-burgundy transition-colors duration-200">
                    {item.q}
                  </span>
                  <span
                    className="mt-1 shrink-0 text-ink/40 transition-all duration-300 group-hover:text-burgundy"
                    style={{ fontSize: "20px", lineHeight: 1 }}
                    aria-hidden
                  >
                    {open === i ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 font-sans text-[15px] leading-relaxed text-ink/70 md:max-w-[72ch]">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <div className="border-t border-ink/10" />
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
