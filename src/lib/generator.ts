import { Problem, ProblemType } from "./types";
import { levels } from "./levels";

let counter = 0;
function uid(): string {
  return `p_${Date.now()}_${++counter}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function logLabel(base: number | string): string {
  if (base === "e") return "\\ln";
  if (base === 10) return "\\log";
  return `\\log_{${base}}`;
}

function logExpr(base: number | string, arg: string): string {
  return `${logLabel(base)}\\!\\left(${arg}\\right)`;
}

export function generateProblem(levelId: number, specificType?: ProblemType): Problem {
  const level = levels.find((l) => l.id === levelId)!;
  const type = specificType ?? pick(level.problemTypes);

  switch (type) {
    case "evaluate":
      return levelId === 2 ? generateEvaluateL2() : generateEvaluateL1();
    case "convert_to_log":
      return generateConvertToLog();
    case "convert_to_exp":
      return generateConvertToExp();
    case "product_rule":
      return generateProductRule();
    case "quotient_rule":
      return generateQuotientRule();
    case "power_rule":
      return generatePowerRule();
    case "expand":
      return generateExpand();
    case "condense":
      return generateCondense();
    case "solve":
      return generateSolve();
    case "change_of_base":
      return generateChangeOfBase();
    default:
      return generateEvaluateL1();
  }
}

// ─── Level 1: Basic evaluate ──────────────────────────────

function generateEvaluateL1(): Problem {
  const variant = randInt(1, 10);

  if (variant <= 2) {
    const base = pick([2, 3, 4, 5, 7, 10]);
    return {
      id: uid(),
      type: "evaluate",
      level: 1,
      promptLatex: `${logExpr(base, "1")}`,
      promptText: `Evaluate ${logLabel(base)}(1)`,
      answerLatex: "0",
      answerValue: 0,
      params: { base, argument: 1, answer: 0 },
    };
  }

  if (variant <= 4) {
    const base = pick([2, 3, 4, 5, 7]);
    return {
      id: uid(),
      type: "evaluate",
      level: 1,
      promptLatex: `${logExpr(base, String(base))}`,
      promptText: `Evaluate ${logLabel(base)}(${base})`,
      answerLatex: "1",
      answerValue: 1,
      params: { base, argument: base, answer: 1 },
    };
  }

  const base = pick([2, 3, 4, 5]);
  const exp = randInt(2, 5);
  const argument = Math.pow(base, exp);

  return {
    id: uid(),
    type: "evaluate",
    level: 1,
    promptLatex: `${logExpr(base, String(argument))}`,
    promptText: `Evaluate log base ${base} of ${argument}`,
    answerLatex: String(exp),
    answerValue: exp,
    params: { base, argument, answer: exp },
  };
}

// ─── Level 2: Common & Natural Logs ───────────────────────

function generateEvaluateL2(): Problem {
  const useNatural = Math.random() < 0.5;

  if (useNatural) {
    const exp = randInt(1, 7);
    return {
      id: uid(),
      type: "evaluate",
      level: 2,
      promptLatex: `\\ln\\!\\left(e^{${exp}}\\right)`,
      promptText: `Evaluate ln(e^${exp})`,
      answerLatex: String(exp),
      answerValue: exp,
      params: { base: "e", argument: `e^${exp}`, answer: exp },
    };
  }

  const exp = randInt(1, 6);
  const argument = Math.pow(10, exp);
  return {
    id: uid(),
    type: "evaluate",
    level: 2,
    promptLatex: `\\log\\!\\left(${argument}\\right)`,
    promptText: `Evaluate log(${argument})`,
    answerLatex: String(exp),
    answerValue: exp,
    params: { base: 10, argument, answer: exp },
  };
}

// ─── Convert to logarithmic form ──────────────────────────

function generateConvertToLog(): Problem {
  const base = pick([2, 3, 4, 5, 10]);
  const exponent = randInt(1, 5);
  const result = Math.pow(base, exponent);

  return {
    id: uid(),
    type: "convert_to_log",
    level: 1,
    promptLatex: `${base}^{${exponent}} = ${result}`,
    promptText: `Write ${base}^${exponent} = ${result} in logarithmic form`,
    answerLatex: `\\log_{${base}}\\!\\left(${result}\\right) = ${exponent}`,
    answerValue: `log_${base}(${result})=${exponent}`,
    params: { base, exponent, result },
  };
}

// ─── Convert to exponential form ──────────────────────────

function generateConvertToExp(): Problem {
  const base = pick([2, 3, 4, 5, 10]);
  const answer = randInt(1, 5);
  const argument = Math.pow(base, answer);

  return {
    id: uid(),
    type: "convert_to_exp",
    level: 1,
    promptLatex: `${logExpr(base, String(argument))} = ${answer}`,
    promptText: `Write log base ${base} of ${argument} = ${answer} in exponential form`,
    answerLatex: `${base}^{${answer}} = ${argument}`,
    answerValue: `${base}^${answer}=${argument}`,
    params: { base, argument, answer },
  };
}

// ─── Product Rule ─────────────────────────────────────────

function generateProductRule(): Problem {
  const base = pick([2, 3, 5]);
  const exp1 = randInt(1, 3);
  const exp2 = randInt(1, 3);
  const m = Math.pow(base, exp1);
  const n = Math.pow(base, exp2);
  const product = m * n;

  return {
    id: uid(),
    type: "product_rule",
    level: 3,
    promptLatex: `${logExpr(base, `${m} \\cdot ${n}`)}`,
    promptText: `Use the Product Rule to evaluate log base ${base} of (${m} × ${n})`,
    answerLatex: String(exp1 + exp2),
    answerValue: exp1 + exp2,
    params: { base, m, n, logM: exp1, logN: exp2 },
  };
}

// ─── Quotient Rule ────────────────────────────────────────

function generateQuotientRule(): Problem {
  const base = pick([2, 3, 5]);
  const exp1 = randInt(3, 5);
  const exp2 = randInt(1, exp1 - 1);
  const m = Math.pow(base, exp1);
  const n = Math.pow(base, exp2);

  return {
    id: uid(),
    type: "quotient_rule",
    level: 3,
    promptLatex: `${logExpr(base, `\\frac{${m}}{${n}}`)}`,
    promptText: `Use the Quotient Rule to evaluate log base ${base} of (${m}/${n})`,
    answerLatex: String(exp1 - exp2),
    answerValue: exp1 - exp2,
    params: { base, m, n, logM: exp1, logN: exp2 },
  };
}

// ─── Power Rule ───────────────────────────────────────────

function generatePowerRule(): Problem {
  const base = pick([2, 3, 5]);
  const m = pick([2, 3, 4, 5, 8, 9, 16, 25, 27]);
  const logM = Math.round(Math.log(m) / Math.log(base));
  if (Math.pow(base, logM) !== m) {
    return generatePowerRule();
  }
  const n = randInt(2, 4);

  return {
    id: uid(),
    type: "power_rule",
    level: 3,
    promptLatex: `${logExpr(base, `${m}^{${n}}`)}`,
    promptText: `Use the Power Rule to evaluate log base ${base} of ${m}^${n}`,
    answerLatex: String(n * logM),
    answerValue: n * logM,
    params: { base, m, n, logM },
  };
}

// ─── Expand ───────────────────────────────────────────────

function generateExpand(): Problem {
  const base = pick([2, 3, 10]);
  const vars = ["x", "y", "z", "a", "b"];
  const numCount = randInt(2, 3);
  const hasDen = Math.random() < 0.6;
  const denCount = hasDen ? randInt(1, 2) : 0;

  const usedVars = vars.slice(0, numCount + denCount);
  const numTerms = usedVars.slice(0, numCount).map((v) => ({
    variable: v,
    exponent: randInt(1, 4),
  }));
  const denTerms = usedVars.slice(numCount).map((v) => ({
    variable: v,
    exponent: randInt(1, 3),
  }));

  const innerNum = numTerms
    .map((t) =>
      t.exponent === 1 ? t.variable : `${t.variable}^{${t.exponent}}`
    )
    .join(" \\cdot ");
  const innerDen = denTerms
    .map((t) =>
      t.exponent === 1 ? t.variable : `${t.variable}^{${t.exponent}}`
    )
    .join(" \\cdot ");

  const inner =
    denTerms.length > 0 ? `\\frac{${innerNum}}{${innerDen}}` : innerNum;

  const expandedParts: string[] = [];
  for (const t of numTerms) {
    const coeff = t.exponent === 1 ? "" : `${t.exponent}`;
    expandedParts.push(`${coeff}${logExpr(base, t.variable)}`);
  }
  for (const t of denTerms) {
    const coeff = t.exponent === 1 ? "" : `${t.exponent}`;
    expandedParts.push(`- ${coeff}${logExpr(base, t.variable)}`);
  }
  const answerLatex = expandedParts.join(" + ").replace(/\+ -/g, "- ");

  return {
    id: uid(),
    type: "expand",
    level: 4,
    promptLatex: logExpr(base, inner),
    promptText: "Expand the logarithmic expression",
    answerLatex,
    answerValue: answerLatex,
    params: {
      base,
      numTerms: JSON.stringify(numTerms),
      denTerms: JSON.stringify(denTerms),
    },
  };
}

// ─── Condense ─────────────────────────────────────────────

function generateCondense(): Problem {
  const base = pick([2, 3, 10]);
  const vars = ["x", "y", "z"];
  const count = randInt(2, 3);
  const usedVars = vars.slice(0, count);

  const terms = usedVars.map((v, i) => ({
    coefficient: randInt(1, 4),
    variable: v,
    sign: (i === 0 ? "+" : pick(["+", "+", "-"])) as "+" | "-",
  }));

  const exprParts = terms.map((t, i) => {
    const prefix = i === 0 ? (t.sign === "-" ? "-" : "") : ` ${t.sign} `;
    const coeff = t.coefficient === 1 ? "" : `${t.coefficient}`;
    return `${prefix}${coeff}${logExpr(base, t.variable)}`;
  });
  const promptLatex = exprParts.join("");

  const posTerms = terms.filter((t) => t.sign === "+");
  const negTerms = terms.filter((t) => t.sign === "-");

  const numInner = posTerms
    .map((t) =>
      t.coefficient === 1
        ? t.variable
        : `${t.variable}^{${t.coefficient}}`
    )
    .join(" \\cdot ");
  const denInner = negTerms
    .map((t) =>
      t.coefficient === 1
        ? t.variable
        : `${t.variable}^{${t.coefficient}}`
    )
    .join(" \\cdot ");

  const condensedInner =
    negTerms.length > 0 ? `\\frac{${numInner}}{${denInner}}` : numInner;
  const answerLatex = logExpr(base, condensedInner);

  return {
    id: uid(),
    type: "condense",
    level: 5,
    promptLatex,
    promptText: "Condense into a single logarithm",
    answerLatex,
    answerValue: answerLatex,
    params: { base, terms: JSON.stringify(terms) },
  };
}

// ─── Solve ────────────────────────────────────────────────

function generateSolve(): Problem {
  const subtype = pick([
    "find_argument",
    "find_argument",
    "find_exponent",
    "find_argument_shifted",
  ]);

  if (subtype === "find_argument") {
    const base = pick([2, 3, 4, 5, 10]);
    const exponent = randInt(1, 5);
    const solution = Math.pow(base, exponent);
    return {
      id: uid(),
      type: "solve",
      level: 6,
      promptLatex: `${logExpr(base, "x")} = ${exponent}`,
      promptText: "Solve for x",
      answerLatex: String(solution),
      answerValue: solution,
      params: { base, exponent, solution, subtype: "find_argument" },
    };
  }

  if (subtype === "find_exponent") {
    const base = pick([2, 3, 4, 5]);
    const exp = randInt(2, 5);
    const result = Math.pow(base, exp);
    return {
      id: uid(),
      type: "solve",
      level: 6,
      promptLatex: `${base}^{x} = ${result}`,
      promptText: "Solve for x",
      answerLatex: String(exp),
      answerValue: exp,
      params: { base, result, solution: exp, subtype: "find_exponent" },
    };
  }

  // find_argument_shifted
  const base = pick([2, 3, 5, 10]);
  const exponent = randInt(1, 3);
  const shift = pick([1, 2, 3, 5, -1, -2, -3]);
  const bPow = Math.pow(base, exponent);
  const solution = bPow - shift;

  if (solution <= 0) return generateSolve();

  const absShift = Math.abs(shift);
  const sign = shift >= 0 ? "+" : "-";

  return {
    id: uid(),
    type: "solve",
    level: 6,
    promptLatex: `${logExpr(base, `x ${sign} ${absShift}`)} = ${exponent}`,
    promptText: "Solve for x",
    answerLatex: String(solution),
    answerValue: solution,
    params: {
      base,
      shift,
      exponent,
      solution,
      subtype: "find_argument_shifted",
    },
  };
}

// ─── Change of Base ───────────────────────────────────────

function generateChangeOfBase(): Problem {
  const base = pick([2, 3, 5, 6, 7, 8]);
  const possibleArgs = [3, 5, 6, 7, 11, 13, 14, 15, 17, 19, 20, 21];
  const argument = pick(possibleArgs.filter((a) => a !== base));

  const result = Math.log(argument) / Math.log(base);
  const rounded = Math.round(result * 1000) / 1000;

  return {
    id: uid(),
    type: "change_of_base",
    level: 7,
    promptLatex: `${logExpr(base, String(argument))}`,
    promptText: `Evaluate log base ${base} of ${argument} using the Change of Base Formula (round to 3 decimal places)`,
    answerLatex: `\\approx ${rounded}`,
    answerValue: rounded,
    params: { base, argument },
  };
}
