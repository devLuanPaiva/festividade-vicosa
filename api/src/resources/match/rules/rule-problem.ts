export interface RuleProblem {
  code: string;
  detail: string;
  field: string;
}

export function problem(code: string, detail: string, field: string): RuleProblem {
  return { code, detail, field };
}
