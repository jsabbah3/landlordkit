/** Rental property cash flow, cap rate, and cash-on-cash return. */

export interface CashFlowInput {
  purchasePrice: number;
  downPaymentPct: number;
  interestRatePct: number; // annual
  loanTermYears: number;
  closingCosts: number; // cash
  rehabCosts: number; // cash
  monthlyRent: number;
  otherMonthlyIncome: number;
  vacancyPct: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly: number;
  maintenancePct: number; // % of rent
  managementPct: number; // % of effective income
  capexPct: number; // % of rent
  otherMonthlyExpense: number;
}

export interface CashFlowResult {
  loanAmount: number;
  downPayment: number;
  monthlyMortgage: number;
  effectiveGrossIncome: number; // monthly, after vacancy
  operatingExpenses: number; // monthly
  noiMonthly: number;
  noiAnnual: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  totalCashInvested: number;
  capRatePct: number;
  cashOnCashPct: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Standard amortized monthly principal + interest payment. */
export function monthlyMortgagePayment(
  principal: number,
  annualRatePct: number,
  termYears: number,
): number {
  const p = Math.max(0, principal);
  const n = Math.max(0, termYears) * 12;
  if (n === 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return round2(p / n);
  const factor = Math.pow(1 + r, n);
  return round2((p * r * factor) / (factor - 1));
}

export function computeCashFlow(input: CashFlowInput): CashFlowResult {
  const price = Math.max(0, input.purchasePrice || 0);
  const downPayment = round2(price * (input.downPaymentPct || 0) / 100);
  const loanAmount = round2(Math.max(0, price - downPayment));
  const monthlyMortgage = monthlyMortgagePayment(
    loanAmount,
    input.interestRatePct || 0,
    input.loanTermYears || 0,
  );

  const rent = Math.max(0, input.monthlyRent || 0);
  const grossIncome = rent + Math.max(0, input.otherMonthlyIncome || 0);
  const vacancyLoss = grossIncome * (input.vacancyPct || 0) / 100;
  const effectiveGrossIncome = round2(grossIncome - vacancyLoss);

  const operatingExpenses = round2(
    (input.propertyTaxAnnual || 0) / 12 +
      (input.insuranceAnnual || 0) / 12 +
      (input.hoaMonthly || 0) +
      rent * (input.maintenancePct || 0) / 100 +
      effectiveGrossIncome * (input.managementPct || 0) / 100 +
      rent * (input.capexPct || 0) / 100 +
      (input.otherMonthlyExpense || 0),
  );

  const noiMonthly = round2(effectiveGrossIncome - operatingExpenses);
  const noiAnnual = round2(noiMonthly * 12);
  const monthlyCashFlow = round2(noiMonthly - monthlyMortgage);
  const annualCashFlow = round2(monthlyCashFlow * 12);

  const totalCashInvested = round2(
    downPayment + (input.closingCosts || 0) + (input.rehabCosts || 0),
  );

  const capRatePct = price > 0 ? round2((noiAnnual / price) * 100) : 0;
  const cashOnCashPct =
    totalCashInvested > 0 ? round2((annualCashFlow / totalCashInvested) * 100) : 0;

  return {
    loanAmount,
    downPayment,
    monthlyMortgage,
    effectiveGrossIncome,
    operatingExpenses,
    noiMonthly,
    noiAnnual,
    monthlyCashFlow,
    annualCashFlow,
    totalCashInvested,
    capRatePct,
    cashOnCashPct,
  };
}
