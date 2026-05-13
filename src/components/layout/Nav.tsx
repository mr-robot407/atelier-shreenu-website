"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled ? "bg-warm-ivory/90 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="container-editorial flex items-center justify-between py-6 md:py-7">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-[22px] italic">Atelier</span>
          <span className="text-micro text-charcoal/60 mt-1">Shreenu</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-micro transition-all duration-300 hover:text-burgundy hover:scale-110"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="text-micro border border-charcoal/60 px-5 py-2.5 transition-all duration-300 hover:bg-charcoal hover:text-warm-ivory hover:scale-105"
          >
            Enquire
          </Link>
        </nav>

        {/* Mobile: single CTA */}
        <Link
          href="#contact"
          className="text-micro border border-charcoal/60 px-4 py-2 md:hidden"
        >
          Enquire
        </Link>
      </div>
    </header>
  );
}