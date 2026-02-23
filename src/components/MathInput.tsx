"use client";

import { useEffect, useRef, useCallback } from "react";

interface MathInputProps {
  value: string;
  onChange: (latex: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

interface MathfieldLike extends HTMLElement {
  value: string;
  insert: (s: string, o?: object) => void;
  mathVirtualKeyboardPolicy: string;
}

const TEMPLATES = [
  { label: "log_b( )", latex: "\\log_{#?}\\left(#?\\right)", title: "Logarithm with base" },
  { label: "log( )", latex: "\\log\\left(#?\\right)", title: "Common logarithm (base 10)" },
  { label: "ln( )", latex: "\\ln\\left(#?\\right)", title: "Natural logarithm (base e)" },
  { label: "xⁿ", latex: "^{#?}", title: "Exponent" },
  { label: "a/b", latex: "\\frac{#?}{#?}", title: "Fraction" },
  { label: "=", latex: "=", title: "Equals sign" },
];

export default function MathInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type or use buttons to enter a math expression…",
}: MathInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mfRef = useRef<MathfieldLike | null>(null);
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef(onSubmit);

  onChangeRef.current = onChange;
  onSubmitRef.current = onSubmit;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mounted = true;
    let mfElement: MathfieldLike | null = null;

    import("mathlive").then(({ MathfieldElement }) => {
      if (!mounted || !container) return;

      const mf = new MathfieldElement() as unknown as MathfieldLike;
      mf.value = value;
      mf.setAttribute("placeholder", placeholder);
      mf.mathVirtualKeyboardPolicy = "manual";

      mf.addEventListener("input", () => {
        onChangeRef.current(mf.value);
      });
      mf.addEventListener("keydown", ((e: KeyboardEvent) => {
        if (e.key === "Enter" && onSubmitRef.current) {
          e.preventDefault();
          onSubmitRef.current();
        }
      }) as EventListener);

      container.appendChild(mf);
      mfElement = mf;
      mfRef.current = mf;
    });

    return () => {
      mounted = false;
      if (mfElement && container.contains(mfElement)) {
        container.removeChild(mfElement);
      }
      mfRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mfRef.current && mfRef.current.value !== value) {
      mfRef.current.value = value;
    }
  }, [value]);

  const insertTemplate = useCallback((latex: string) => {
    if (mfRef.current) {
      mfRef.current.insert(latex, { focus: true });
      onChangeRef.current(mfRef.current.value);
    }
  }, []);

  const clearInput = useCallback(() => {
    if (mfRef.current) {
      mfRef.current.value = "";
      onChangeRef.current("");
    }
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {TEMPLATES.map((t) => (
          <button
            key={t.label}
            onClick={() => insertTemplate(t.latex)}
            title={t.title}
            className="math-toolbar-btn"
            type="button"
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={clearInput}
          title="Clear"
          className="math-toolbar-btn text-gray-400 hover:text-error"
          type="button"
        >
          ✕ Clear
        </button>
      </div>
      <div ref={containerRef} />
    </div>
  );
}
