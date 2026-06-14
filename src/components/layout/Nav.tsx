"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const firstMobileNavRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver — track which section is in view for active nav state
  useEffect(() => {
    const ids = site.nav.map((item) => item.href.slice(1));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(`#${id}`);
        },
        { threshold: 0.2, rootMargin: "-80px 0px -50% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Focus first menu item when mobile menu opens
  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => firstMobileNavRef.current?.focus(), 50);
    }
  }, [menuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Skip to main content — keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-warm-ivory focus:px-4 focus:py-2 focus:text-charcoal focus:border focus:border-charcoal focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-parchment border-b border-burgundy"
            : "bg-warm-ivory border-b border-stone/30"
        )}
      >
        <div className="relative flex items-center py-2 md:py-2 px-6 md:px-20 w-full">

          {/* ── Logo lockup — left ── */}
          <Link
            href="/"
            aria-label="Atelier Shreenu — home"
            className="flex cursor-pointer items-center gap-3 flex-shrink-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
          >
            <Image
              src="/Shreenu logo beige.jpeg"
              alt="Atelier Shreenu"
              width={120}
              height={120}
              priority
              className="w-16 h-16 md:w-[80px] md:h-[80px] object-contain flex-shrink-0"
            />
            <span className="hidden md:flex flex-col gap-1">
              <span className="font-sans font-normal text-[21px] tracking-[0.04em] text-charcoal/85 leading-none">
                Atelier Shreenu
              </span>
              <span className="font-sans font-normal text-[17px] tracking-[0.05em] text-charcoal/45 leading-none">
                by The Vrindavan Project
              </span>
            </span>
          </Link>

          {/* ── Desktop navigation — truly centred in the header bar ── */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-14 md:flex" aria-label="Main navigation">
            {site.nav.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "cursor-pointer text-micro rounded-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2",
                    isActive
                      ? "text-burgundy border-b border-burgundy pb-px"
                      : "text-charcoal/70 hover:text-burgundy"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right group: CTA (desktop) + hamburger (mobile) ── */}
          <div className="ml-auto flex items-center gap-4">
            {/* CTA — desktop only, inside the flex row so nothing can cover it */}
            <Link
              href="#contact"
              style={{ touchAction: "manipulation" }}
              className="hidden md:inline-flex cursor-pointer items-center min-h-[44px] text-micro border border-burgundy text-burgundy px-5 transition-colors duration-200 hover:bg-burgundy hover:text-warm-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
            >
              Begin a conversation
            </Link>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              style={{ touchAction: "manipulation" }}
              className="flex flex-col justify-center items-center gap-[5px] w-[44px] h-[44px] cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-1 md:hidden"
            >
              <span className={cn("block w-5 h-[1.5px] bg-charcoal origin-center transition-all duration-200", menuOpen && "translate-y-[6px] rotate-45")} />
              <span className={cn("block w-5 h-[1.5px] bg-charcoal transition-all duration-200", menuOpen && "opacity-0")} />
              <span className={cn("block w-5 h-[1.5px] bg-charcoal origin-center transition-all duration-200", menuOpen && "-translate-y-[6px] -rotate-45")} />
            </button>
          </div>

        </div>

        {/* ── Mobile menu drawer ── */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-label="Navigation menu"
          aria-hidden={!menuOpen}
          className={cn(
            "md:hidden grid transition-[grid-template-rows] duration-300 ease-in-out",
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="bg-warm-ivory border-t border-stone/30">
              <nav
                className="container-editorial flex flex-col py-4"
                aria-label="Mobile navigation"
              >
                {site.nav.map((item, idx) => {
                  const isActive = activeSection === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      ref={idx === 0 ? firstMobileNavRef : undefined}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      style={{ touchAction: "manipulation" }}
                      className={cn(
                        "flex cursor-pointer items-center min-h-[52px] border-b border-stone/20 text-micro transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy rounded-sm",
                        isActive ? "text-burgundy" : "text-charcoal/70 hover:text-burgundy"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <Link
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  style={{ touchAction: "manipulation" }}
                  className="mt-5 mb-2 inline-flex cursor-pointer items-center justify-center min-h-[48px] text-micro border border-burgundy text-burgundy transition-all duration-200 hover:bg-burgundy hover:text-warm-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
                >
                  Begin a conversation
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
