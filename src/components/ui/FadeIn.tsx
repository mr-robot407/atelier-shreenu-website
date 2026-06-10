"use client";

import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type FadeInProps = Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport"> & {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function FadeIn({ children, delay = 0, y = 24, className, ...rest }: FadeInProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: reduced ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: reduced ? 0 : delay,
      }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
