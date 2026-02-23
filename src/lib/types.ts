export type ProblemType =
  | "evaluate"
  | "convert_to_log"
  | "convert_to_exp"
  | "product_rule"
  | "quotient_rule"
  | "power_rule"
  | "expand"
  | "condense"
  | "solve"
  | "change_of_base";

export interface Problem {
  id: string;
  type: ProblemType;
  level: number;
  promptLatex: string;
  promptText: string;
  answerLatex: string;
  answerValue: number | string;
  params: Record<string, number | string>;
}

export interface Step {
  explanation: string;
  latex?: string;
}

export interface Solution {
  answer: string;
  answerLatex: string;
  steps: Step[];
}

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  concepts: Concept[];
  problemTypes: ProblemType[];
}

export interface Concept {
  title: string;
  explanation: string;
  formula?: string;
  example?: string;
}
