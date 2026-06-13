"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { X } from "lucide-react";

const linkClass = "cursor-pointer transition-colors hover:text-burgundy focus:outline-none focus-visible:ring-1 focus-visible:ring-burgundy rounded-sm";

// TODO: Replace placeholder text below with verbatim Privacy Policy + Terms of Use from client PDF
const PRIVACY_AND_TERMS_CONTENT = `
PRIVACY POLICY

[Privacy Policy text — to be provided by client]

Effective date: [DATE PENDING]

TERMS OF USE

[Terms of Use text — to be provided by client]
`;

function PrivacyModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus trap and ESC key
  useEffect(() => {
    const prev = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Policy and Terms of Use"
      className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-charcoal/70 backdrop-blur-sm p-0 md:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full md:max-w-2xl bg-warm-ivory text-charcoal overflow-y-auto md:max-h-[80vh] flex flex-col">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-charcoal/10 bg-warm-ivory px-8 py-5">
          <span className="font-sans text-[13px] font-medium uppercase tracking-widest text-burgundy">
            Privacy &amp; Terms
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close privacy and terms"
            className="flex h-11 w-11 cursor-pointer items-center justify-center border border-charcoal/15 transition-colors hover:border-burgundy hover:text-burgundy focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-10">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-charcoal/75">
            {PRIVACY_AND_TERMS_CONTENT.trim()}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="bg-warm-ivory py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-12 gap-8 border-t border-charcoal/15 pt-14">
            <div className="col-span-12 md:col-span-5">
              <div className="font-serif text-3xl italic">Atelier Shreenu</div>
              <div className="text-micro mt-2 text-charcoal/55">Est. 2012 · by The Vrindavan Project</div>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-charcoal/60">
                Timeless architecture and thoughtful interiors
              </p>
            </div>

            <div className="col-span-6 md:col-span-3">
              <div className="text-micro text-charcoal/50">Navigate</div>
              <ul className="mt-5 space-y-3 text-sm">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-6 md:col-span-4">
              <div className="text-micro text-charcoal/50">Follow</div>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    YouTube
                  </a>
                </li>
                <li>
                  <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer legal block */}
          <div className="mt-16 border-t border-charcoal/10 pt-8 text-micro text-charcoal/55">
            <p className="mb-4 text-xs leading-relaxed text-charcoal/50">
              Atelier Shreenu by The Vrindavan Project · Shreenu and Ranjeet Design LLP · Palam Vihar, Gurugram 122017, Haryana, India · {site.contact.email} · +91 95602 06195
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} Atelier Shreenu · Shreenu and Ranjeet Design LLP</div>
              <button
                onClick={() => setShowPrivacy(true)}
                className="cursor-pointer text-left underline underline-offset-2 transition-colors hover:text-burgundy focus:outline-none focus-visible:ring-1 focus-visible:ring-burgundy rounded-sm"
              >
                Privacy and Terms
              </button>
            </div>
          </div>
        </Container>
      </footer>

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </>
  );
}
