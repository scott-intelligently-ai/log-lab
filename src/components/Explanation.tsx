"use client";

import { Step } from "@/lib/types";
import MathDisplay from "./MathDisplay";

interface ExplanationProps {
  steps: Step[];
  title?: string;
}

export default function Explanation({
  steps,
  title = "Step-by-Step Solution",
}: ExplanationProps) {
  if (steps.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-100">
        <h3 className="font-semibold text-primary-800 text-sm uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="p-5 space-y-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="step-enter flex gap-3"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                <RichText text={step.explanation} />
              </p>
              {step.latex && (
                <div className="mt-2 p-3 bg-surface-50 rounded-lg border border-gray-100 overflow-x-auto">
                  <MathDisplay latex={step.latex} block />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          return <MathDisplay key={i} latex={part.slice(1, -1)} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
