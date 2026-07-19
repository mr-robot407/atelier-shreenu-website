"use client";

import { useState } from "react";
import { LegalModal } from "@/components/ui/LegalModal";
import { InstagramIcon, YouTubeIcon, LinkedInIcon, FacebookIcon } from "@/components/ui/SocialIcons";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/ateliershreenu?igsh=eDBsY25iZ3VtaW1r", Icon: InstagramIcon },
  { label: "YouTube",   href: "https://www.youtube.com/@AtelierShreenu",                         Icon: YouTubeIcon   },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/atelier-shreenu/",               Icon: LinkedInIcon  },
  { label: "Facebook",  href: "https://www.facebook.com/share/1DUhNAnMMQ/",                      Icon: FacebookIcon  },
];

export function BlogFooter() {
  const [showLegal, setShowLegal] = useState(false);
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="border-t border-charcoal/10 bg-parchment py-12 mt-24">
        <div className="container-editorial flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-serif text-[20px] text-charcoal">The Blog</p>
              <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-warm-grey mt-1">
                by Atelier Shreenu
              </p>
            </div>
            <p className="font-sans text-[11px] text-charcoal/40 tracking-wide">
              © {year} Shreenu and Ranjeet Design LLP. All rights reserved.
            </p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] uppercase tracking-[0.12em] text-burgundy hover:underline underline-offset-2"
            >
              ateliershreenu.com →
            </a>
          </div>

          {/* A7 — Social links */}
          <div className="flex items-center gap-5 border-t border-charcoal/10 pt-6">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-charcoal/40 hover:text-burgundy transition-colors duration-200"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* A9 — Terms & Conditions link */}
          <div className="border-t border-charcoal/10 pt-6">
            <button
              onClick={() => setShowLegal(true)}
              className="font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/40 hover:text-burgundy transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-burgundy rounded-sm"
            >
              Privacy &amp; Terms
            </button>
          </div>
        </div>
      </footer>

      {showLegal && <LegalModal onClose={() => setShowLegal(false)} />}
    </>
  );
}
