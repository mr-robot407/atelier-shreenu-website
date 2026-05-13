"use client";

import { useEffect, useState } from "react";

export function Shutter() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Start opening after logo displays
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 1800);

    // Remove from DOM after animation completes
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 3800);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-burgundy transition-transform duration-[2000ms] ${
        isOpen ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div 
          className="relative opacity-0"
          style={{
            animation: "fadeIn 1s ease-out 300ms forwards"
          }}
        >
          <svg viewBox="0 0 200 240" className="h-48 w-48 md:h-64 md:w-64">
            {/* Octagonal frame - outer */}
            <path
              d="M60 10 L140 10 L180 50 L180 130 L140 170 L60 170 L20 130 L20 50 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-warm-ivory"
            />
            {/* Octagonal frame - inner */}
            <path
              d="M65 15 L135 15 L175 55 L175 125 L135 165 L65 165 L25 125 L25 55 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-warm-ivory"
            />
            
            {/* AS monogram */}
            <text
              x="100"
              y="110"
              fontSize="80"
              fontFamily="serif"
              fontWeight="300"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-warm-ivory"
              style={{ letterSpacing: "-0.05em" }}
            >
              AS
            </text>
          </svg>
        </div>

        {/* Text */}
        <div 
          className="text-center opacity-0"
          style={{
            animation: "fadeIn 1s ease-out 600ms forwards"
          }}
        >
          <div className="text-warm-ivory font-sans text-xs tracking-[0.2em] mb-2">
            ATELIER
          </div>
          <div className="text-warm-ivory font-serif text-4xl md:text-5xl tracking-wide">
            SHREENU
          </div>
          <div className="text-warm-ivory/70 font-sans text-[0.65rem] tracking-[0.15em] mt-3">
            ARCHITECTURE & INTERIOR DESIGN
          </div>
        </div>
      </div>
    </div>
  );
}