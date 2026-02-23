"use client";

import { useState, useCallback, useEffect } from "react";
import { levels } from "@/lib/levels";
import { Problem, Solution, Level, Concept } from "@/lib/types";
import { solveProblem, checkAnswer, parseCustomProblem } from "@/lib/solver";
import { generateProblem } from "@/lib/generator";
import LevelSelector from "@/components/LevelSelector";
import MathDisplay from "@/components/MathDisplay";
import MathInput from "@/components/MathInput";
import Explanation from "@/components/Explanation";

type Mode = "practice" | "ask";

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [mode, setMode] = useState<Mode>("practice");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [customLatex, setCustomLatex] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showConcepts, setShowConcepts] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const level = levels.find((l) => l.id === currentLevel)!;

  const newProblem = useCallback(() => {
    const p = generateProblem(currentLevel);
    setProblem(p);
    setUserAnswer("");
    setSolution(null);
    setFeedback(null);
    setShowExplanation(false);
  }, [currentLevel]);

  useEffect(() => {
    if (mode === "practice") newProblem();
  }, [currentLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectLevel = useCallback(
    (id: number) => {
      setCurrentLevel(id);
      setMode("practice");
      setSolution(null);
      setFeedback(null);
      setShowExplanation(false);
      setCustomLatex("");
      setMobileSidebarOpen(false);
    },
    []
  );

  const handleCheck = useCallback(() => {
    if (!problem || !userAnswer.trim()) return;
    const result = checkAnswer(userAnswer, problem);
    setFeedback({ correct: result.correct, text: result.feedback });
    if (!result.correct && !solution) {
      const sol = solveProblem(problem);
      setSolution(sol);
    }
  }, [problem, userAnswer, solution]);

  const handleShowExplanation = useCallback(() => {
    if (!problem) return;
    if (!solution) {
      const sol = solveProblem(problem);
      setSolution(sol);
    }
    setShowExplanation(true);
  }, [problem, solution]);

  const handleAskExplain = useCallback(() => {
    if (!customLatex.trim()) return;
    const parsed = parseCustomProblem(customLatex);
    if (parsed) {
      setProblem(parsed);
      const sol = solveProblem(parsed);
      setSolution(sol);
      setShowExplanation(true);
      setFeedback(null);
    } else {
      setProblem(null);
      setSolution(null);
      setShowExplanation(false);
      setFeedback({
        correct: false,
        text: "I couldn't parse that expression. Try entering a logarithm like log₂(8), log(100), or ln(e³).",
      });
    }
  }, [customLatex]);

  const handleModeSwitch = useCallback(
    (m: Mode) => {
      setMode(m);
      setFeedback(null);
      setSolution(null);
      setShowExplanation(false);
      if (m === "practice") newProblem();
      else {
        setProblem(null);
        setCustomLatex("");
      }
    },
    [newProblem]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className="text-primary-600">Log</span>
              <span className="text-gray-800">Lab</span>
            </h1>
            <span className="hidden sm:inline text-xs text-gray-400 font-medium bg-gray-100 rounded-full px-2 py-0.5">
              Logarithm Tutor
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Level{" "}
            <span className="font-bold" style={{ color: level.color }}>
              {level.id}
            </span>{" "}
            <span className="hidden sm:inline">— {level.title}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* ─── Desktop Sidebar ──────────────────────────── */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200 bg-surface-50 py-4 px-3 overflow-y-auto custom-scrollbar">
          <LevelSelector
            levels={levels}
            currentLevel={currentLevel}
            onSelectLevel={handleSelectLevel}
          />
        </aside>

        {/* ─── Mobile Sidebar Overlay ───────────────────── */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black/20"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-72 bg-surface-50 border-r border-gray-200 pt-16 pb-4 px-3 overflow-y-auto custom-scrollbar shadow-xl">
              <LevelSelector
                levels={levels}
                currentLevel={currentLevel}
                onSelectLevel={handleSelectLevel}
              />
            </aside>
          </div>
        )}

        {/* ─── Main Content ─────────────────────────────── */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Level header */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {level.icon} {level.title}
                </h2>
                <p className="text-gray-500 mt-1 text-sm max-w-xl">
                  {level.description}
                </p>
              </div>
              <button
                onClick={() => setShowConcepts(!showConcepts)}
                className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1 transition-colors"
              >
                {showConcepts ? "Hide" : "Show"} Key Concepts
                <svg
                  className={`w-4 h-4 transition-transform ${showConcepts ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {showConcepts && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {level.concepts.map((c, i) => (
                  <ConceptCard key={i} concept={c} />
                ))}
              </div>
            )}
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
            {(["practice", "ask"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m === "practice" ? "Practice Problems" : "Ask Your Own"}
              </button>
            ))}
          </div>

          {/* ─── Practice Mode ──────────────────────────── */}
          {mode === "practice" && problem && (
            <div className="space-y-5">
              {/* Problem card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Problem
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${level.color}15`,
                      color: level.color,
                    }}
                  >
                    Level {level.id}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 text-sm">
                  {problem.promptText}
                </p>
                <div className="p-4 bg-surface-50 rounded-xl border border-gray-100">
                  <MathDisplay latex={problem.promptLatex} block />
                </div>
              </div>

              {/* Answer input */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-3">
                  Your Answer
                </label>
                <MathInput
                  value={userAnswer}
                  onChange={setUserAnswer}
                  onSubmit={handleCheck}
                  placeholder="Enter your answer here…"
                />

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={handleCheck}
                    disabled={!userAnswer.trim()}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium rounded-xl text-sm transition-colors"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={handleShowExplanation}
                    className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl text-sm transition-colors"
                  >
                    Show Explanation
                  </button>
                  <button
                    onClick={newProblem}
                    className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl text-sm transition-colors"
                  >
                    New Problem
                  </button>
                </div>

                {feedback && (
                  <div
                    className={`mt-4 p-4 rounded-xl text-sm font-medium ${
                      feedback.correct
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    <span className="mr-2">
                      {feedback.correct ? "✓" : "✗"}
                    </span>
                    {feedback.text}
                  </div>
                )}
              </div>

              {showExplanation && solution && (
                <Explanation steps={solution.steps} />
              )}

              {(feedback?.correct || showExplanation) && (
                <div className="flex gap-3">
                  <button
                    onClick={newProblem}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors"
                  >
                    Next Problem →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── Ask Mode ───────────────────────────────── */}
          {mode === "ask" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                  Enter a Logarithm Problem
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Type any logarithm expression using the toolbar buttons or
                  your keyboard, then click Explain to see a step-by-step
                  solution.
                </p>
                <MathInput
                  value={customLatex}
                  onChange={setCustomLatex}
                  onSubmit={handleAskExplain}
                  placeholder="Try log₂(8), log(1000), ln(e⁵) …"
                />

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={handleAskExplain}
                    disabled={!customLatex.trim()}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium rounded-xl text-sm transition-colors"
                  >
                    Explain This
                  </button>
                </div>

                {feedback && !feedback.correct && (
                  <div className="mt-4 p-4 rounded-xl text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    {feedback.text}
                  </div>
                )}
              </div>

              {showExplanation && solution && (
                <Explanation steps={solution.steps} />
              )}

              {/* Quick examples */}
              {!showExplanation && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Quick Examples — Click to Try
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_EXAMPLES.map((ex) => (
                      <button
                        key={ex.latex}
                        onClick={() => {
                          setCustomLatex(ex.latex);
                          setFeedback(null);
                          setSolution(null);
                          setShowExplanation(false);
                        }}
                        className="px-3 py-1.5 bg-surface-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-lg text-sm text-gray-600 hover:text-primary-700 transition-all"
                      >
                        <MathDisplay latex={ex.display} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const QUICK_EXAMPLES = [
  { display: "\\log_{2}(32)", latex: "\\log_{2}\\left(32\\right)" },
  { display: "\\log(10000)", latex: "\\log\\left(10000\\right)" },
  { display: "\\ln(e^{7})", latex: "\\ln\\left(e^{7}\\right)" },
  { display: "\\log_{3}(81)", latex: "\\log_{3}\\left(81\\right)" },
  { display: "\\log_{5}(125)", latex: "\\log_{5}\\left(125\\right)" },
];

function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <div className="concept-card space-y-2">
      <h4 className="font-semibold text-gray-800 text-sm">
        {concept.title}
      </h4>
      <p className="text-gray-600 text-sm leading-relaxed">
        {concept.explanation}
      </p>
      {concept.formula && (
        <div className="p-3 bg-surface-50 rounded-lg">
          <MathDisplay latex={concept.formula} block />
        </div>
      )}
      {concept.example && (
        <div className="p-2.5 bg-primary-50/50 rounded-lg border border-primary-100">
          <p className="text-xs text-primary-600 font-medium mb-1">
            Example
          </p>
          <MathDisplay latex={concept.example} />
        </div>
      )}
    </div>
  );
}
