"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

interface MathDisplayProps {
  latex: string;
  block?: boolean;
  className?: string;
}

export default function MathDisplay({
  latex,
  block = false,
  className = "",
}: MathDisplayProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || !latex) return;
    try {
      katex.render(latex, ref.current, {
        throwOnError: false,
        displayMode: block,
        trust: true,
      });
    } catch {
      if (ref.current) ref.current.textContent = latex;
    }
  }, [latex, block]);

  return (
    <span
      ref={ref}
      className={`${block ? "math-block" : ""} ${className}`}
    />
  );
}
