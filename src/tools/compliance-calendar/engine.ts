import {
  FEDERAL_OBLIGATIONS,
  STATE_OBLIGATIONS,
  CITY_OBLIGATIONS,
  type ComplianceProfile,
  type Condition,
  type Obligation,
} from "./obligations";

export interface DueObligation {
  obligation: Obligation;
  /** Next occurrence as ISO date (YYYY-MM-DD), or null for `varies`. */
  nextDue: string | null;
}

function conditionMet(c: Condition, p: ComplianceProfile): boolean {
  switch (c.type) {
    case "always": return true;
    case "entity": return p.entityType === c.value;
    case "usesContractors": return p.usesContractors;
    case "builtPre1978": return p.builtPre1978;
    case "unitsAtLeast": return (p.units || 0) >= c.n;
  }
}

const applies = (o: Obligation, p: ComplianceProfile): boolean =>
  o.conditions.every((c) => conditionMet(c, p));

/** Next occurrence of a MM-DD on/after `from` (this year or next). */
function nextFixed(mmdd: string, from: Date): Date {
  const [m, d] = mmdd.split("-").map(Number);
  let year = from.getFullYear();
  let cand = new Date(year, m - 1, d);
  if (cand < stripTime(from)) cand = new Date(++year, m - 1, d);
  return cand;
}

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Anniversary item: next occurrence of the formation month/day, respecting
 *  the recurrence interval (annual/biennial) from the formation year. */
function nextAnniversary(formationISO: string, everyYears: number, from: Date): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(formationISO);
  if (!m) return null;
  const [, fy, fmo, fd] = m.map(Number) as unknown as number[];
  const step = Math.max(1, everyYears || 1);
  let year = from.getFullYear();
  // align to the formation cycle
  while ((year - fy) % step !== 0) year++;
  let cand = new Date(year, fmo - 1, fd);
  if (cand < stripTime(from)) cand = new Date(year + step, fmo - 1, fd);
  return cand;
}

const iso = (d: Date): string => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

function nextDueFor(o: Obligation, p: ComplianceProfile, from: Date): string | null {
  if (o.dueType === "varies") return null;
  if (o.dueType === "anniversary") {
    if (!p.llcFormationDate) return null; // surfaced as "needs your formation date"
    const next = nextAnniversary(p.llcFormationDate, o.everyYears ?? 1, from);
    return next ? iso(next) : null;
  }
  // fixed: earliest upcoming among its dates
  const dates = (o.dueDates ?? []).map((mmdd) => nextFixed(mmdd, from));
  if (!dates.length) return null;
  dates.sort((a, b) => a.getTime() - b.getTime());
  return iso(dates[0]);
}

/**
 * Returns every obligation that applies to the profile, with its next due date,
 * sorted by date (undated `varies` items last).
 */
export function getObligations(
  profile: ComplianceProfile,
  today: Date = new Date(),
): DueObligation[] {
  const pool: Obligation[] = [
    ...FEDERAL_OBLIGATIONS,
    ...(STATE_OBLIGATIONS[profile.state] ?? []),
    ...(profile.city ? CITY_OBLIGATIONS[profile.city] ?? [] : []),
  ];
  const due = pool
    .filter((o) => applies(o, profile))
    .map((o) => ({ obligation: o, nextDue: nextDueFor(o, profile, today) }));
  return due.sort((a, b) => {
    if (a.nextDue && b.nextDue) return a.nextDue.localeCompare(b.nextDue);
    if (a.nextDue) return -1;
    if (b.nextDue) return 1;
    return 0;
  });
}
