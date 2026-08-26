"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { LegalModal } from "@/components/ui/LegalModal";
import { InstagramIcon, YouTubeIcon, LinkedInIcon, FacebookIcon } from "@/components/ui/SocialIcons";

const linkClass = "cursor-pointer transition-colors hover:text-burgundy focus:outline-none focus-visible:ring-1 focus-visible:ring-burgundy rounded-sm";

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="bg-warm-ivory py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-12 gap-8 border-t border-charcoal/15 pt-14">
            <div className="col-span-12 md:col-span-5">
              <div className="font-serif text-3xl italic">Atelier Shreenu</div>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-charcoal/60">
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
                <li>
                  <a href="/blog/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-6 md:col-span-4">
              <div className="text-micro text-charcoal/50">Follow</div>
              <ul className="mt-5 space-y-4">
                <li>
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-charcoal/50 hover:text-burgundy transition-colors duration-200 inline-flex">
                    <InstagramIcon className="w-7 h-7" strokeWidth={2} />
                  </a>
                </li>
                <li>
                  <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-charcoal/50 hover:text-burgundy transition-colors duration-200 inline-flex">
                    <YouTubeIcon className="w-7 h-7" strokeWidth={2} />
                  </a>
                </li>
                <li>
                  <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-charcoal/50 hover:text-burgundy transition-colors duration-200 inline-flex">
                    <LinkedInIcon className="w-7 h-7" strokeWidth={2} />
                  </a>
                </li>
                <li>
                  <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-charcoal/50 hover:text-burgundy transition-colors duration-200 inline-flex">
                    <FacebookIcon className="w-7 h-7" strokeWidth={2} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer legal block */}
          <div className="mt-16 border-t border-charcoal/10 pt-8 text-micro text-charcoal/55">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div>© {new Date().getFullYear()} Atelier Shreenu · Shreenu and Ranjeet Design LLP</div>
                <div className="mt-1 text-charcoal/40">Atelier Shreenu is the trading name of Shreenu and Ranjeet Design LLP</div>
              </div>
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

      {showPrivacy && <LegalModal onClose={() => setShowPrivacy(false)} />}
    </>
  );
}
