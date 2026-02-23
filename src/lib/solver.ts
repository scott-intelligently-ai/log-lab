import { Problem, Solution, Step } from "./types";

export function solveProblem(problem: Problem): Solution {
  switch (problem.type) {
    case "evaluate":
      return solveEvaluate(problem);
    case "convert_to_log":
      return solveConvertToLog(problem);
    case "convert_to_exp":
      return solveConvertToExp(problem);
    case "product_rule":
      return solveProductRule(problem);
    case "quotient_rule":
      return solveQuotientRule(problem);
    case "power_rule":
      return solvePowerRule(problem);
    case "expand":
      return solveExpand(problem);
    case "condense":
      return solveCondense(problem);
    case "solve":
      return solveSolve(problem);
    case "change_of_base":
      return solveChangeOfBase(problem);
    default:
      return {
        answer: "",
        answerLatex: "",
        steps: [{ explanation: "This problem type is not yet supported." }],
      };
  }
}

export function checkAnswer(
  userAnswer: string,
  problem: Problem
): { correct: boolean; feedback: string } {
  const cleaned = userAnswer.replace(/\s+/g, "").replace(/\\left|\\right/g, "");
  const expected = String(problem.answerValue);
  const expectedLatex = problem.answerLatex
    .replace(/\s+/g, "")
    .replace(/\\left|\\right/g, "");

  if (cleaned === expected || cleaned === expectedLatex) {
    return { correct: true, feedback: "Correct!" };
  }

  const userNum = parseFloat(cleaned);
  const expectedNum = parseFloat(expected);
  if (!isNaN(userNum) && !isNaN(expectedNum)) {
    if (Math.abs(userNum - expectedNum) < 0.01) {
      return { correct: true, feedback: "Correct!" };
    }
    if (Math.abs(userNum - expectedNum) < 0.1) {
      return {
        correct: false,
        feedback: "Very close! Check your rounding.",
      };
    }
  }

  return {
    correct: false,
    feedback: `Not quite. The correct answer is ${expected}.`,
  };
}

function logLabel(base: number | string): string {
  if (base === "e") return "\\ln";
  if (base === 10) return "\\log";
  return `\\log_{${base}}`;
}

function logExpr(base: number | string, arg: string): string {
  return `${logLabel(base)}\\!\\left(${arg}\\right)`;
}

// ─── Evaluate ──────────────────────────────────────────────

function solveEvaluate(p: Problem): Solution {
  const { base, argument, answer } = p.params;
  const steps: Step[] = [];
  const bLabel = logLabel(base);

  steps.push({
    explanation: `We need to evaluate this ${bLabel === "\\ln" ? "natural logarithm" : "logarithm"}: $${logExpr(base, String(argument))}$.`,
    latex: `${logExpr(base, String(argument))} = \\text{?}`,
  });

  if (Number(argument) === 1) {
    steps.push({
      explanation:
        "Remember: the logarithm of 1 in any base is always 0, because any number raised to the power 0 equals 1.",
      latex: `${base === "e" ? "e" : base}^{0} = 1`,
    });
    steps.push({
      explanation: "Therefore:",
      latex: `${logExpr(base, "1")} = 0`,
    });
    return { answer: "0", answerLatex: "0", steps };
  }

  if (base !== "e" && Number(argument) === Number(base)) {
    steps.push({
      explanation:
        "Remember: the logarithm of the base itself is always 1, because any number raised to the power 1 equals itself.",
      latex: `${base}^{1} = ${base}`,
    });
    steps.push({
      explanation: "Therefore:",
      latex: `${logExpr(base, String(base))} = 1`,
    });
    return { answer: "1", answerLatex: "1", steps };
  }

  const baseStr = base === "e" ? "e" : String(base);

  steps.push({
    explanation: `Recall the definition: $${logLabel(base)}(x) = y$ means $${baseStr}^{y} = x$. We need to find y such that:`,
    latex: `${baseStr}^{y} = ${argument}`,
  });

  steps.push({
    explanation: `Think about powers of ${baseStr}. Since $${baseStr}^{${answer}} = ${argument}$:`,
    latex: `${baseStr}^{${answer}} = ${argument}`,
  });

  steps.push({
    explanation: "Therefore:",
    latex: `\\boxed{${logExpr(base, String(argument))} = ${answer}}`,
  });

  return {
    answer: String(answer),
    answerLatex: String(answer),
    steps,
  };
}

// ─── Convert to Logarithmic Form ──────────────────────────

function solveConvertToLog(p: Problem): Solution {
  const { base, exponent, result } = p.params;
  const steps: Step[] = [];

  steps.push({
    explanation: "We need to rewrite this exponential equation in logarithmic form.",
    latex: `${base}^{${exponent}} = ${result}`,
  });

  steps.push({
    explanation:
      "Use the definition: if $b^{y} = x$, then $\\log_{b}(x) = y$. Here $b = " +
      base + "$, $y = " + exponent + "$, and $x = " + result + "$.",
    latex: `b^{y} = x \\iff \\log_{b}(x) = y`,
  });

  const ansLatex = `\\log_{${base}}\\!\\left(${result}\\right) = ${exponent}`;
  steps.push({
    explanation: "Substituting our values:",
    latex: `\\boxed{${ansLatex}}`,
  });

  return {
    answer: ansLatex,
    answerLatex: ansLatex,
    steps,
  };
}

// ─── Convert to Exponential Form ──────────────────────────

function solveConvertToExp(p: Problem): Solution {
  const { base, argument, answer } = p.params;
  const steps: Step[] = [];

  steps.push({
    explanation: "We need to rewrite this logarithmic equation in exponential form.",
    latex: `${logExpr(base, String(argument))} = ${answer}`,
  });

  steps.push({
    explanation:
      "Use the definition: if $\\log_{b}(x) = y$, then $b^{y} = x$. Here $b = " +
      base + "$, $x = " + argument + "$, and $y = " + answer + "$.",
    latex: `\\log_{b}(x) = y \\iff b^{y} = x`,
  });

  const ansLatex = `${base}^{${answer}} = ${argument}`;
  steps.push({
    explanation: "Substituting our values:",
    latex: `\\boxed{${ansLatex}}`,
  });

  return { answer: ansLatex, answerLatex: ansLatex, steps };
}

// ─── Product Rule ─────────────────────────────────────────

function solveProductRule(p: Problem): Solution {
  const { base, m, n, logM, logN } = p.params;
  const product = Number(m) * Number(n);
  const steps: Step[] = [];

  steps.push({
    explanation: `We need to expand $${logExpr(base, String(product))}$ knowing that $${product} = ${m} \\times ${n}$.`,
    latex: `${logExpr(base, `${m} \\cdot ${n}`)}`,
  });

  steps.push({
    explanation: "Apply the Product Rule: log_b(m·n) = log_b(m) + log_b(n).",
    latex: `${logExpr(base, `${m} \\cdot ${n}`)} = ${logExpr(base, String(m))} + ${logExpr(base, String(n))}`,
  });

  const numAnswer = Number(logM) + Number(logN);
  steps.push({
    explanation: `Evaluate each logarithm: $${logExpr(base, String(m))} = ${logM}$ and $${logExpr(base, String(n))} = ${logN}$.`,
    latex: `= ${logM} + ${logN}`,
  });

  steps.push({
    explanation: "Therefore:",
    latex: `\\boxed{${logExpr(base, String(product))} = ${numAnswer}}`,
  });

  return {
    answer: String(numAnswer),
    answerLatex: String(numAnswer),
    steps,
  };
}

// ─── Quotient Rule ────────────────────────────────────────

function solveQuotientRule(p: Problem): Solution {
  const { base, m, n, logM, logN } = p.params;
  const quotient = Number(m) / Number(n);
  const steps: Step[] = [];

  steps.push({
    explanation: `We need to evaluate $${logExpr(base, String(quotient))}$ knowing that $${quotient} = ${m} \\div ${n}$.`,
    latex: `${logExpr(base, `\\frac{${m}}{${n}}`)}`,
  });

  steps.push({
    explanation:
      "Apply the Quotient Rule: log_b(m/n) = log_b(m) − log_b(n).",
    latex: `${logExpr(base, `\\frac{${m}}{${n}}`)} = ${logExpr(base, String(m))} - ${logExpr(base, String(n))}`,
  });

  const numAnswer = Number(logM) - Number(logN);
  steps.push({
    explanation: `Evaluate each logarithm: $${logExpr(base, String(m))} = ${logM}$ and $${logExpr(base, String(n))} = ${logN}$.`,
    latex: `= ${logM} - ${logN}`,
  });

  steps.push({
    explanation: "Therefore:",
    latex: `\\boxed{${logExpr(base, String(quotient))} = ${numAnswer}}`,
  });

  return {
    answer: String(numAnswer),
    answerLatex: String(numAnswer),
    steps,
  };
}

// ─── Power Rule ───────────────────────────────────────────

function solvePowerRule(p: Problem): Solution {
  const { base, m, n, logM } = p.params;
  const powered = Math.pow(Number(m), Number(n));
  const steps: Step[] = [];

  steps.push({
    explanation: `We need to evaluate $${logExpr(base, String(powered))}$ knowing that $${powered} = ${m}^{${n}}$.`,
    latex: `${logExpr(base, `${m}^{${n}}`)}`,
  });

  steps.push({
    explanation:
      "Apply the Power Rule: log_b(m^n) = n · log_b(m). The exponent comes out front as a multiplier.",
    latex: `${logExpr(base, `${m}^{${n}}`)} = ${n} \\cdot ${logExpr(base, String(m))}`,
  });

  const numAnswer = Number(n) * Number(logM);
  steps.push({
    explanation: `Since $${logExpr(base, String(m))} = ${logM}$:`,
    latex: `= ${n} \\times ${logM} = ${numAnswer}`,
  });

  steps.push({
    explanation: "Therefore:",
    latex: `\\boxed{${logExpr(base, String(powered))} = ${numAnswer}}`,
  });

  return {
    answer: String(numAnswer),
    answerLatex: String(numAnswer),
    steps,
  };
}

// ─── Expand ───────────────────────────────────────────────

interface ExpandTerm {
  variable: string;
  exponent: number;
}

function solveExpand(p: Problem): Solution {
  const base = p.params.base;
  const numTerms: ExpandTerm[] = JSON.parse(String(p.params.numTerms));
  const denTerms: ExpandTerm[] = JSON.parse(String(p.params.denTerms));
  const steps: Step[] = [];

  const innerNum = numTerms
    .map((t) => (t.exponent === 1 ? t.variable : `${t.variable}^{${t.exponent}}`))
    .join(" \\cdot ");
  const innerDen = denTerms
    .map((t) => (t.exponent === 1 ? t.variable : `${t.variable}^{${t.exponent}}`))
    .join(" \\cdot ");

  const inner =
    denTerms.length > 0
      ? `\\frac{${innerNum}}{${innerDen}}`
      : innerNum;

  steps.push({
    explanation: "We need to expand this logarithmic expression using the properties of logarithms.",
    latex: logExpr(base, inner),
  });

  if (denTerms.length > 0) {
    steps.push({
      explanation:
        "First, apply the Quotient Rule to separate the numerator and denominator.",
      latex: `= ${logExpr(base, innerNum)} - ${logExpr(base, innerDen)}`,
    });
  }

  if (numTerms.length > 1) {
    const expanded = numTerms.map((t) =>
      logExpr(base, t.exponent === 1 ? t.variable : `${t.variable}^{${t.exponent}}`)
    ).join(" + ");
    steps.push({
      explanation: "Apply the Product Rule to split the multiplication into addition.",
      latex: `${logExpr(base, innerNum)} = ${expanded}`,
    });
  }

  if (denTerms.length > 1) {
    const expanded = denTerms.map((t) =>
      logExpr(base, t.exponent === 1 ? t.variable : `${t.variable}^{${t.exponent}}`)
    ).join(" + ");
    steps.push({
      explanation:
        "Similarly, apply the Product Rule to the denominator terms.",
      latex: `${logExpr(base, innerDen)} = ${expanded}`,
    });
  }

  const allParts: string[] = [];
  for (const t of numTerms) {
    if (t.exponent === 1) {
      allParts.push(`${logExpr(base, t.variable)}`);
    } else {
      allParts.push(`${t.exponent}${logExpr(base, t.variable)}`);
    }
  }
  for (const t of denTerms) {
    if (t.exponent === 1) {
      allParts.push(`- ${logExpr(base, t.variable)}`);
    } else {
      allParts.push(`- ${t.exponent}${logExpr(base, t.variable)}`);
    }
  }

  steps.push({
    explanation:
      "Apply the Power Rule to bring all exponents out front as coefficients.",
    latex: `= ${allParts.join(" ")}`,
  });

  const answerLatex = allParts.join(" ");
  steps.push({
    explanation: "The fully expanded form is:",
    latex: `\\boxed{${answerLatex}}`,
  });

  return {
    answer: answerLatex,
    answerLatex,
    steps,
  };
}

// ─── Condense ─────────────────────────────────────────────

interface CondenseTerm {
  coefficient: number;
  variable: string;
  sign: "+" | "-";
}

function solveCondense(p: Problem): Solution {
  const base = p.params.base;
  const terms: CondenseTerm[] = JSON.parse(String(p.params.terms));
  const steps: Step[] = [];

  const exprParts = terms.map((t, i) => {
    const prefix = i === 0 ? (t.sign === "-" ? "-" : "") : ` ${t.sign} `;
    const coeff = t.coefficient === 1 ? "" : `${t.coefficient}`;
    return `${prefix}${coeff}${logExpr(base, t.variable)}`;
  });

  steps.push({
    explanation:
      "We need to condense this expression into a single logarithm.",
    latex: exprParts.join(""),
  });

  const poweredParts = terms.map((t, i) => {
    const prefix = i === 0 ? (t.sign === "-" ? "-" : "") : ` ${t.sign} `;
    const varExpr =
      t.coefficient === 1
        ? t.variable
        : `${t.variable}^{${t.coefficient}}`;
    return `${prefix}${logExpr(base, varExpr)}`;
  });

  steps.push({
    explanation:
      "First, apply the Power Rule in reverse: move each coefficient up as an exponent.",
    latex: poweredParts.join(""),
  });

  const posTerms = terms.filter((t) => t.sign === "+");
  const negTerms = terms.filter((t) => t.sign === "-");

  const numInner = posTerms
    .map((t) =>
      t.coefficient === 1 ? t.variable : `${t.variable}^{${t.coefficient}}`
    )
    .join(" \\cdot ");

  const denInner = negTerms
    .map((t) =>
      t.coefficient === 1 ? t.variable : `${t.variable}^{${t.coefficient}}`
    )
    .join(" \\cdot ");

  if (posTerms.length > 1) {
    steps.push({
      explanation:
        "Apply the Product Rule in reverse: combine addition into multiplication inside the log.",
      latex: `${posTerms
        .map((t) =>
          logExpr(
            base,
            t.coefficient === 1
              ? t.variable
              : `${t.variable}^{${t.coefficient}}`
          )
        )
        .join(" + ")} = ${logExpr(base, numInner)}`,
    });
  }

  let answerInner: string;
  if (negTerms.length > 0) {
    answerInner = `\\frac{${numInner}}{${denInner}}`;
    steps.push({
      explanation:
        "Apply the Quotient Rule in reverse: subtraction becomes division inside the log.",
      latex: `= ${logExpr(base, answerInner)}`,
    });
  } else {
    answerInner = numInner;
  }

  const answerLatex = logExpr(base, answerInner);
  steps.push({
    explanation: "The condensed form is:",
    latex: `\\boxed{${answerLatex}}`,
  });

  return { answer: answerLatex, answerLatex, steps };
}

// ─── Solve ────────────────────────────────────────────────

function solveSolve(p: Problem): Solution {
  const subtype = String(p.params.subtype);
  switch (subtype) {
    case "find_argument":
      return solveFindArgument(p);
    case "find_exponent":
      return solveFindExponent(p);
    case "find_argument_shifted":
      return solveFindArgumentShifted(p);
    default:
      return solveFindArgument(p);
  }
}

function solveFindArgument(p: Problem): Solution {
  const { base, exponent, solution } = p.params;
  const steps: Step[] = [];

  steps.push({
    explanation: "We need to solve for x.",
    latex: `${logExpr(base, "x")} = ${exponent}`,
  });

  steps.push({
    explanation: "Convert to exponential form: if $\\log_{b}(x) = y$, then $x = b^{y}$.",
    latex: `x = ${base}^{${exponent}}`,
  });

  steps.push({
    explanation: `Calculate $${base}^{${exponent}}$:`,
    latex: `x = ${base}^{${exponent}} = ${solution}`,
  });

  steps.push({
    explanation: "Therefore:",
    latex: `\\boxed{x = ${solution}}`,
  });

  return {
    answer: String(solution),
    answerLatex: String(solution),
    steps,
  };
}

function solveFindExponent(p: Problem): Solution {
  const { base, result, solution } = p.params;
  const steps: Step[] = [];

  steps.push({
    explanation: "We need to solve for x.",
    latex: `${base}^{x} = ${result}`,
  });

  steps.push({
    explanation:
      "Convert to logarithmic form: if b^x = a, then x = log_b(a).",
    latex: `x = ${logExpr(base, String(result))}`,
  });

  steps.push({
    explanation: `Since $${base}^{${solution}} = ${result}$:`,
    latex: `x = ${solution}`,
  });

  steps.push({
    explanation: "Therefore:",
    latex: `\\boxed{x = ${solution}}`,
  });

  return {
    answer: String(solution),
    answerLatex: String(solution),
    steps,
  };
}

function solveFindArgumentShifted(p: Problem): Solution {
  const { base, shift, exponent, solution } = p.params;
  const bPow = Math.pow(Number(base), Number(exponent));
  const steps: Step[] = [];
  const shiftNum = Number(shift);
  const sign = shiftNum >= 0 ? "+" : "-";
  const absShift = Math.abs(shiftNum);

  steps.push({
    explanation: "We need to solve for x.",
    latex: `${logExpr(base, `x ${sign} ${absShift}`)} = ${exponent}`,
  });

  steps.push({
    explanation:
      "Convert to exponential form. The entire argument of the logarithm becomes the result of the exponentiation.",
    latex: `x ${sign} ${absShift} = ${base}^{${exponent}}`,
  });

  steps.push({
    explanation: `Calculate $${base}^{${exponent}} = ${bPow}$:`,
    latex: `x ${sign} ${absShift} = ${bPow}`,
  });

  const invSign = shiftNum >= 0 ? "-" : "+";
  steps.push({
    explanation: `Isolate x by ${shiftNum >= 0 ? "subtracting" : "adding"} ${absShift} from both sides:`,
    latex: `x = ${bPow} ${invSign} ${absShift} = ${solution}`,
  });

  steps.push({
    explanation: "Therefore:",
    latex: `\\boxed{x = ${solution}}`,
  });

  return {
    answer: String(solution),
    answerLatex: String(solution),
    steps,
  };
}

// ─── Change of Base ───────────────────────────────────────

function solveChangeOfBase(p: Problem): Solution {
  const { base, argument } = p.params;
  const steps: Step[] = [];

  steps.push({
    explanation: `We need to evaluate $${logExpr(base, String(argument))}$ using the Change of Base Formula.`,
    latex: `${logExpr(base, String(argument))}`,
  });

  steps.push({
    explanation:
      "The Change of Base Formula says we can rewrite any logarithm using common logs (or natural logs):",
    latex: `\\log_{b}(x) = \\frac{\\ln(x)}{\\ln(b)} = \\frac{\\log(x)}{\\log(b)}`,
  });

  steps.push({
    explanation: "Applying the formula:",
    latex: `${logExpr(base, String(argument))} = \\frac{\\ln(${argument})}{\\ln(${base})}`,
  });

  const lnArg = Math.log(Number(argument));
  const lnBase = Math.log(Number(base));
  const result = lnArg / lnBase;

  steps.push({
    explanation: "Computing the numerator and denominator:",
    latex: `= \\frac{${lnArg.toFixed(4)}}{${lnBase.toFixed(4)}}`,
  });

  const rounded = Math.round(result * 1000) / 1000;
  steps.push({
    explanation: "Therefore:",
    latex: `\\boxed{${logExpr(base, String(argument))} \\approx ${rounded}}`,
  });

  return {
    answer: String(rounded),
    answerLatex: `\\approx ${rounded}`,
    steps,
  };
}

// ─── Custom Problem Parser ────────────────────────────────

export function parseCustomProblem(latex: string): Problem | null {
  const cleaned = latex
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\s+/g, "");

  const logBaseEval = cleaned.match(
    /\\log_\{?(\d+)\}?\((\d+)\)/
  );
  if (logBaseEval) {
    const base = parseInt(logBaseEval[1]);
    const arg = parseInt(logBaseEval[2]);
    const answer = Math.log(arg) / Math.log(base);
    if (Number.isFinite(answer)) {
      const rounded = Math.abs(answer - Math.round(answer)) < 0.0001
        ? Math.round(answer)
        : Math.round(answer * 1000) / 1000;
      return {
        id: "custom",
        type: "evaluate",
        level: 1,
        promptLatex: `${logExpr(base, String(arg))}`,
        promptText: `Evaluate log base ${base} of ${arg}`,
        answerLatex: String(rounded),
        answerValue: rounded,
        params: { base, argument: arg, answer: rounded },
      };
    }
  }

  const commonLogEval = cleaned.match(/\\log\((\d+)\)/);
  if (commonLogEval) {
    const arg = parseInt(commonLogEval[1]);
    const answer = Math.log10(arg);
    const rounded = Math.abs(answer - Math.round(answer)) < 0.0001
      ? Math.round(answer)
      : Math.round(answer * 1000) / 1000;
    return {
      id: "custom",
      type: "evaluate",
      level: 2,
      promptLatex: `\\log\\!\\left(${arg}\\right)`,
      promptText: `Evaluate log(${arg})`,
      answerLatex: String(rounded),
      answerValue: rounded,
      params: { base: 10, argument: arg, answer: rounded },
    };
  }

  const lnEval = cleaned.match(/\\ln\(([^)]+)\)/);
  if (lnEval) {
    const argStr = lnEval[1];
    const eMatch = argStr.match(/e\^?\{?(\d+)\}?/);
    if (eMatch) {
      const exp = parseInt(eMatch[1]);
      return {
        id: "custom",
        type: "evaluate",
        level: 2,
        promptLatex: `\\ln\\!\\left(e^{${exp}}\\right)`,
        promptText: `Evaluate ln(e^${exp})`,
        answerLatex: String(exp),
        answerValue: exp,
        params: { base: "e", argument: `e^${exp}`, answer: exp },
      };
    }
  }

  return null;
}
