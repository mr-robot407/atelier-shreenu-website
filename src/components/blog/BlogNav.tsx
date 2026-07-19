"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

function CategoryLinks({ onClose }: { onClose?: () => void }) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";

  return (
    <>
      {CATEGORIES.map((c) => (
        <Link
          key={c.value}
          href={c.value ? `/blog?category=${c.value}` : "/blog"}
          onClick={onClose}
          className={`font-sans text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 ${
            active === c.value
              ? "text-burgundy border-b border-burgundy pb-0.5"
              : "text-charcoal/70 hover:text-burgundy"
          }`}
        >
          {c.label}
        </Link>
      ))}
    </>
  );
}

function MobileCategoryLinks({ onClose }: { onClose: () => void }) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";

  return (
    <>
      {CATEGORIES.map((c) => (
        <Link
          key={c.value}
          href={c.value ? `/blog?category=${c.value}` : "/blog"}
          onClick={onClose}
          style={{ touchAction: "manipulation" }}
          className={`flex items-center min-h-[52px] border-b border-stone/20 font-sans text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy rounded-sm ${
            active === c.value ? "text-burgundy" : "text-charcoal/70 hover:text-burgundy"
          }`}
        >
          {c.label}
        </Link>
      ))}
    </>
  );
}

export function BlogNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-parchment border-b border-burgundy"
            : "bg-parchment/90 border-b border-charcoal/10 backdrop-blur-sm"
        }`}
      >
        <div className="relative flex items-center w-full pl-0 pr-4 md:pl-2 md:pr-6 xl:pr-20">

          {/* LHS — Logo + wordmark (same scale as main nav) */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Atelier Shreenu — main website"
            className="flex items-center gap-3 flex-shrink-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
          >
            <Image
              src="/Shreenu logo beige.jpeg"
              alt="Atelier Shreenu"
              width={120}
              height={120}
              priority
              className="w-16 h-16 md:w-[80px] md:h-[80px] object-contain flex-shrink-0"
            />
            <span className="flex flex-col gap-1">
              <span className="font-sans font-normal text-[20px] tracking-[0.04em] text-burgundy leading-none">
                The Blog
              </span>
              <span className="font-sans font-normal text-[16px] tracking-[0.05em] text-burgundy/60 leading-none">
                by Atelier Shreenu
              </span>
            </span>
          </a>

          {/* Centre — Category nav (desktop) */}
          <nav className="hidden md:flex md:flex-1 md:justify-center items-center gap-8 xl:gap-6">
            <Suspense fallback={
              CATEGORIES.map((c) => (
                <span key={c.value} className="font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/40">{c.label}</span>
              ))
            }>
              <CategoryLinks />
            </Suspense>
          </nav>

          {/* RHS — CTAs (desktop) + Hamburger (mobile) */}
          <div className="ml-auto flex-shrink-0 flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center min-h-[44px] font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/60 px-5 transition-all duration-200 hover:bg-burgundy hover:text-warm-ivory whitespace-nowrap"
            >
              Visit Studio
            </a>
            <a
              href="#contact"
              className="hidden md:inline-flex items-center min-h-[44px] font-sans text-[11px] uppercase tracking-[0.12em] border border-burgundy text-burgundy px-5 transition-colors duration-200 hover:bg-burgundy hover:text-warm-ivory whitespace-nowrap"
            >
              Begin a Conversation
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              style={{ touchAction: "manipulation" }}
              className="flex flex-col justify-center items-center gap-[5px] w-[44px] h-[44px] cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy md:hidden"
            >
              <span className={`block w-5 h-[1.5px] bg-charcoal origin-center transition-all duration-200 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-charcoal transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-charcoal origin-center transition-all duration-200 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          role="dialog"
          aria-label="Navigation menu"
          aria-hidden={!menuOpen}
          className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-in-out ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="bg-parchment border-t border-stone/30">
              <nav className="container-editorial flex flex-col py-4">
                <Suspense fallback={null}>
                  <MobileCategoryLinks onClose={() => setMenuOpen(false)} />
                </Suspense>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="mt-5 flex items-center min-h-[52px] border-b border-stone/20 font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/60 hover:text-burgundy transition-colors duration-200"
                >
                  Visit Studio →
                </a>
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 mb-2 inline-flex items-center justify-center min-h-[48px] font-sans text-[11px] uppercase tracking-[0.12em] border border-burgundy text-burgundy transition-all duration-200 hover:bg-burgundy hover:text-warm-ivory"
                >
                  Begin a Conversation
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
