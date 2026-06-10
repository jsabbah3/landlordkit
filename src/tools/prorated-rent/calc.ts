/** Prorated rent calculation. Supports the three accepted methods landlords use. */

export type ProrateMethod = "actual-days" | "thirty-day" | "banker-year";

export interface ProrateInput {
  monthlyRent: number;
  daysOccupied: number;
  /** Days in the relevant month (used by the actual-days method). */
  daysInMonth: number;
  method: ProrateMethod;
}

export interface ProrateResult {
  dailyRate: number;
  proratedRent: number;
  methodLabel: string;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const labels: Record<ProrateMethod, string> = {
  "actual-days": "Actual days in month (rent ÷ days in month)",
  "thirty-day": "30-day month (rent ÷ 30)",
  "banker-year": "Banker's year (annual rent ÷ 365)",
};

export function computeProratedRent(input: ProrateInput): ProrateResult {
  const rent = Math.max(0, input.monthlyRent || 0);
  const days = Math.max(0, input.daysOccupied || 0);
  const dim = Math.max(1, input.daysInMonth || 30);

  let dailyRate: number;
  switch (input.method) {
    case "thirty-day":
      dailyRate = rent / 30;
      break;
    case "banker-year":
      dailyRate = (rent * 12) / 365;
      break;
    case "actual-days":
    default:
      dailyRate = rent / dim;
      break;
  }

  return {
    dailyRate: round2(dailyRate),
    proratedRent: round2(dailyRate * days),
    methodLabel: labels[input.method],
  };
}

/** Days in a given month (1-indexed month). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Days a tenant occupies in a move-in month: from the move-in day through the
 * end of the month, inclusive.
 */
export function daysFromMoveIn(year: number, month: number, day: number): number {
  const dim = daysInMonth(year, month);
  return Math.max(0, dim - day + 1);
}
