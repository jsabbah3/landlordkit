/**
 * Landlord Regulation Index (2026) — a transparent, reproducible score of how
 * much statutory regulation binds a small landlord in each state, computed
 * ONLY from verified (high/medium) fields in the unified legal DB.
 *
 * This is deliberately a *regulation intensity* index, not a "best/worst
 * state" ranking — the same score reads as protection to a tenant and
 * compliance load to a landlord. States without enough verified fields are
 * excluded and listed as such rather than guessed at.
 */
import { US_STATES } from "@/lib/states";
import { allStateLegal, type Field, type StateLegal } from "@/lib/legal-db";

export interface IndexComponent {
  label: string;
  points: number;
  max: number;
  basis: string; // what the points were awarded for
}

export interface IndexEntry {
  code: string;
  name: string;
  slug: string;
  score: number;
  max: number;
  components: IndexComponent[];
}

const ok = (f: Field<unknown>) =>
  (f.confidence === "high" || f.confidence === "medium") && f.value != null;

/** Minimum scoreable components for a state to be ranked at all. */
export const MIN_COMPONENTS = 4;

function scoreState(r: StateLegal): IndexEntry | null {
  const c: IndexComponent[] = [];
  const d = r.securityDeposit;

  if (ok(d.maxLimit)) {
    const unlimited = /no statutory limit|no limit/i.test(String(d.maxLimit.value));
    c.push({ label: "Deposit amount cap", points: unlimited ? 0 : 2, max: 2, basis: String(d.maxLimit.value) });
  }
  if (ok(d.interestRequired)) {
    c.push({ label: "Interest on deposits", points: d.interestRequired.value ? 2 : 0, max: 2, basis: d.interestRequired.value ? "Required" : "Not required" });
  }
  if (ok(d.returnDeadlineDays)) {
    const days = Number(d.returnDeadlineDays.value);
    c.push({ label: "Deposit return deadline", points: days <= 21 ? 2 : days <= 30 ? 1 : 0, max: 2, basis: `${days} days` });
  }
  if (ok(r.lateFee.capSummary)) {
    const reasonable = /reasonable|no statutory cap/i.test(String(r.lateFee.capSummary.value));
    c.push({ label: "Late fee cap", points: reasonable ? 1 : 2, max: 2, basis: String(r.lateFee.capSummary.value) });
  }
  if (ok(r.lateFee.graceDays)) {
    const days = Number(r.lateFee.graceDays.value);
    c.push({ label: "Mandatory grace period", points: days > 0 ? 1 : 0, max: 1, basis: days > 0 ? `${days} days` : "None" });
  }
  if (ok(r.notice.rentIncreaseDays)) {
    const days = Number(r.notice.rentIncreaseDays.value);
    c.push({ label: "Rent increase notice", points: days >= 60 ? 2 : days >= 30 ? 1 : 0, max: 2, basis: `${days} days` });
  }
  if (ok(r.notice.terminationDays)) {
    const days = Number(r.notice.terminationDays.value);
    c.push({ label: "Termination notice", points: days >= 60 ? 2 : days >= 30 ? 1 : 0, max: 2, basis: `${days} days` });
  }

  if (c.length < MIN_COMPONENTS) return null;
  const meta = US_STATES.find((s) => s.code === r.state)!;
  return {
    code: r.state,
    name: r.name,
    slug: meta.slug,
    score: c.reduce((a, x) => a + x.points, 0),
    max: c.reduce((a, x) => a + x.max, 0),
    components: c,
  };
}

export function regulationIndex(): { ranked: IndexEntry[]; excluded: string[] } {
  const ranked: IndexEntry[] = [];
  const excluded: string[] = [];
  for (const rec of allStateLegal()) {
    const e = scoreState(rec);
    if (e) ranked.push(e);
    else excluded.push(rec.name);
  }
  // Rank by score share (score/max) so states with more verified components
  // aren't penalized; ties broken by absolute score, then name.
  ranked.sort((a, b) => b.score / b.max - a.score / a.max || b.score - a.score || a.name.localeCompare(b.name));
  excluded.sort();
  return { ranked, excluded };
}
