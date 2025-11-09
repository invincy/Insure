export interface GoalPlanPayload {
  planId: 'JeevanLakshya733' | string;
  goalId: string;
  age: number;
  term: number;
  ppt: number;
  sumAssured: number;
  annualPremium: number;
  totalPaid: number;
  estimatedMaturity: number | { totalMaturity: number };
  bonusAssumptionNote: string;
}
