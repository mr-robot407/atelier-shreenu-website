"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function Shutter() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const openTimer = setTimeout(() => setIsOpen(true), 1800);
    const removeTimer = setTimeout(() => setShouldRender(false), 3800);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-burgundy transition-transform duration-[2000ms] ${
        isOpen ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)" }}
    >
      <div
        className="opacity-0"
        style={{ animation: "fadeIn 1.2s ease-out 300ms forwards" }}
      >
        <Image
          src="/Shreenu logo beige.jpeg"
          alt="Atelier Shreenu"
          width={280}
          height={280}
          priority
          className="w-[220px] md:w-[280px]"
        />
      </div>
    </div>
  );
}
