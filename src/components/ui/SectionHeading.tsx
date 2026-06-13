"use client";

import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn("font-sans font-medium uppercase tracking-widest text-burgundy", className)}
      style={{ fontSize: "20px", lineHeight: 1 }}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-serif font-normal leading-[1.05] tracking-tight",
        Tag === "h1" ? "text-[64px] md:text-[110px]" : "text-[44px] md:text-[72px]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
