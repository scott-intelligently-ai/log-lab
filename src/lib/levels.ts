import { Level } from "./types";

export const levels: Level[] = [
  {
    id: 1,
    title: "Understanding Logarithms",
    subtitle: "The foundation",
    description:
      "Learn what logarithms are, how they connect to exponents, and evaluate simple logarithmic expressions.",
    icon: "🔑",
    color: "#6366f1",
    concepts: [
      {
        title: "Definition of a Logarithm",
        explanation:
          'A logarithm answers: "What exponent do I need?" If you raise base b to the power y and get x, then log base b of x equals y.',
        formula: "\\log_{b}(x) = y \\iff b^{y} = x",
        example:
          "\\log_{2}(8) = 3 \\quad\\text{because}\\quad 2^{3} = 8",
      },
      {
        title: "Special Values",
        explanation:
          "Two values you should memorize: the log of 1 is always 0 (because any number to the 0th power is 1), and the log of the base itself is always 1.",
        formula:
          "\\log_{b}(1) = 0 \\qquad \\log_{b}(b) = 1",
      },
    ],
    problemTypes: ["evaluate", "convert_to_log", "convert_to_exp"],
  },
  {
    id: 2,
    title: "Common & Natural Logs",
    subtitle: "Special bases",
    description:
      "Work with the two most important logarithm bases: 10 (common log) and e (natural log).",
    icon: "🌍",
    color: "#8b5cf6",
    concepts: [
      {
        title: "Common Logarithm (log)",
        explanation:
          "When no base is written, it means base 10. This is called the common logarithm, written simply as log(x).",
        formula: "\\log(x) = \\log_{10}(x)",
        example: "\\log(1000) = 3 \\quad\\text{because}\\quad 10^{3} = 1000",
      },
      {
        title: "Natural Logarithm (ln)",
        explanation:
          "The natural logarithm uses base e ≈ 2.718. It is written as ln(x) and is extremely important in science and calculus.",
        formula: "\\ln(x) = \\log_{e}(x)",
        example: "\\ln(e^{5}) = 5",
      },
    ],
    problemTypes: ["evaluate"],
  },
  {
    id: 3,
    title: "Properties of Logarithms",
    subtitle: "The three key rules",
    description:
      "Master the Product Rule, Quotient Rule, and Power Rule — the building blocks for all logarithm manipulation.",
    icon: "⚙️",
    color: "#ec4899",
    concepts: [
      {
        title: "Product Rule",
        explanation:
          "The logarithm of a product equals the sum of the logarithms. This lets you split multiplication inside a log into addition outside.",
        formula:
          "\\log_{b}(m \\cdot n) = \\log_{b}(m) + \\log_{b}(n)",
        example:
          "\\log_{2}(4 \\cdot 8) = \\log_{2}(4) + \\log_{2}(8) = 2 + 3 = 5",
      },
      {
        title: "Quotient Rule",
        explanation:
          "The logarithm of a quotient equals the difference of the logarithms. Division inside becomes subtraction outside.",
        formula:
          "\\log_{b}\\!\\left(\\frac{m}{n}\\right) = \\log_{b}(m) - \\log_{b}(n)",
        example:
          "\\log_{3}\\!\\left(\\frac{27}{9}\\right) = \\log_{3}(27) - \\log_{3}(9) = 3 - 2 = 1",
      },
      {
        title: "Power Rule",
        explanation:
          "An exponent inside a logarithm can be pulled out front as a multiplier. This is one of the most useful properties.",
        formula:
          "\\log_{b}(m^{n}) = n \\cdot \\log_{b}(m)",
        example:
          "\\log_{2}(8^{4}) = 4 \\cdot \\log_{2}(8) = 4 \\cdot 3 = 12",
      },
    ],
    problemTypes: ["product_rule", "quotient_rule", "power_rule"],
  },
  {
    id: 4,
    title: "Expanding Expressions",
    subtitle: "Breaking logs apart",
    description:
      "Use the properties of logarithms to expand complex expressions into simpler terms.",
    icon: "🔓",
    color: "#f59e0b",
    concepts: [
      {
        title: "Expanding Logarithms",
        explanation:
          "Expanding means using the Product, Quotient, and Power Rules to rewrite a single logarithm as a sum or difference of simpler logarithms.",
        formula:
          "\\log_{b}\\!\\left(\\frac{x^{2} y}{z^{3}}\\right) = 2\\log_{b}(x) + \\log_{b}(y) - 3\\log_{b}(z)",
      },
    ],
    problemTypes: ["expand"],
  },
  {
    id: 5,
    title: "Condensing Expressions",
    subtitle: "Combining logs together",
    description:
      "Reverse the expansion process: combine sums and differences of logarithms into a single logarithmic expression.",
    icon: "🔒",
    color: "#14b8a6",
    concepts: [
      {
        title: "Condensing Logarithms",
        explanation:
          "Condensing is the reverse of expanding. Use the rules backwards: addition becomes multiplication inside, subtraction becomes division, and coefficients become exponents.",
        formula:
          "2\\log(x) + \\log(y) - 3\\log(z) = \\log\\!\\left(\\frac{x^{2} y}{z^{3}}\\right)",
      },
    ],
    problemTypes: ["condense"],
  },
  {
    id: 6,
    title: "Solving Equations",
    subtitle: "Finding the unknown",
    description:
      "Solve equations that contain logarithmic or exponential expressions by converting between forms and applying properties.",
    icon: "🎯",
    color: "#ef4444",
    concepts: [
      {
        title: "Solving by Converting Forms",
        explanation:
          "To solve log_b(x) = y, convert to exponential form: x = b^y. To solve b^x = y, convert to logarithmic form: x = log_b(y).",
        formula:
          "\\log_{b}(x) = y \\implies x = b^{y}",
        example:
          "\\log_{2}(x) = 5 \\implies x = 2^{5} = 32",
      },
      {
        title: "Solving with Properties",
        explanation:
          "If an equation has multiple log terms, use properties to condense them into a single log, then convert to exponential form to solve.",
        example:
          "\\log(x) + \\log(x-3) = 1 \\implies \\log(x(x-3)) = 1 \\implies x(x-3) = 10",
      },
    ],
    problemTypes: ["solve"],
  },
  {
    id: 7,
    title: "Change of Base",
    subtitle: "Converting between bases",
    description:
      "Use the Change of Base Formula to rewrite logarithms in any base using common or natural logarithms.",
    icon: "🔄",
    color: "#0ea5e9",
    concepts: [
      {
        title: "Change of Base Formula",
        explanation:
          "To evaluate a logarithm with an unusual base, rewrite it as a fraction of logarithms in a base your calculator supports (base 10 or base e).",
        formula:
          "\\log_{b}(x) = \\frac{\\log(x)}{\\log(b)} = \\frac{\\ln(x)}{\\ln(b)}",
        example:
          "\\log_{3}(7) = \\frac{\\ln(7)}{\\ln(3)} \\approx 1.771",
      },
    ],
    problemTypes: ["change_of_base"],
  },
];
