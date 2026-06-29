"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

const faqs = [
  {
    q: "Who is Atelier Shreenu best suited for?",
    a: "Clients who value thoughtful design, long-term quality, and a collaborative process. We design for those who live with intention, people seeking spaces rooted in their site and lifestyle, built to reveal their character over years of living rather than at the moment of arrival. If you value a founder-led practice, material excellence, and design that stays timeless, let's start a conversation.",
  },
  {
    q: "What kind of projects do you take on?",
    a: "Residential homes and farmhouses, hospitality, and select commercial spaces, from heritage-sensitive restorations to contemporary new builds. Every project shares one thing: a site and a client we feel a genuine alignment with.",
  },
  {
    q: "Do you take on architecture, interiors, or both?",
    a: "Both, increasingly as a single discipline. The studio's greatest strength shows when architecture and interior design are engaged together, with Ranjeet and Shreenu working in tandem from the first line drawn, the result is a single coherent experience rather than two disciplines in sequence. We also take on either as a standalone consultancy, depending on where a project already stands.",
  },
  {
    q: "Where is the studio based, and do you work outside Delhi NCR?",
    a: "The studio is in Palam Vihar, Gurugram, though the practice extends across India. We've designed homes, farmhouses, and hospitality projects well beyond NCR, and travel for site visits as a project requires.",
  },
  {
    q: "How do we begin?",
    a: "Every project begins with a conversation. Start with a complimentary ten-minute Discovery Phone Call. From there, we recommend the right next step: a Google Meet, an on-site visit, or both — each scoped and quoted before we begin.",
  },
];

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
