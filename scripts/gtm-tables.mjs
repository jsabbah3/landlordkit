/**
 * Generates markdown data tables for the /gtm linkable-asset articles directly
 * from the verified state-data files — so published stats always match the
 * site. Run: node scripts/gtm-tables.mjs   (re-run after any data.ts change)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { US_STATES } from "../src/lib/states.ts";
import { DEPOSIT_INTEREST } from "../src/tools/security-deposit-interest/data.ts";
import { LATE_FEE } from "../src/tools/late-fee/data.ts";
import { RENT_INCREASE } from "../src/tools/rent-increase-notice/data.ts";
import { DEPOSIT_RETURN } from "../src/tools/security-deposit-return/data.ts";

const NAME = new Map(US_STATES.map((s) => [s.code, s.name]));
const SLUG = new Map(US_STATES.map((s) => [s.code, s.slug]));
const BASE = "https://getlandlordkit.com";

mkdirSync(new URL("../gtm", import.meta.url), { recursive: true });
const write = (file, body) =>
  writeFileSync(new URL(`../gtm/${file}`, import.meta.url), body);

/* ---- Table 1: deposit interest (states with a rule) ---- */
let t1 = `| State | Rate | Holding period | Statute |\n|---|---|---|---|\n`;
for (const [code, r] of Object.entries(DEPOSIT_INTEREST)) {
  const rate =
    r.rateBasis === "fixed" ? `${r.defaultRatePct}%`
    : r.rateBasis === "published-annually" ? `Published annually (~${r.defaultRatePct}%)`
    : "Bank account rate";
  const hold = r.minHoldingMonths > 0 ? `${r.minHoldingMonths} months` : "None";
  t1 += `| [${NAME.get(code)}](${BASE}/tools/security-deposit-interest-calculator/${SLUG.get(code)}) | ${rate} | ${hold} | ${r.cite.statute} |\n`;
}

/* ---- Table 2: late fee caps (states with a numeric cap) ---- */
let t2 = `| State | Max late fee | Grace period | Statute |\n|---|---|---|---|\n`;
for (const [code, r] of Object.entries(LATE_FEE)) {
  if (r.capType === "reasonable" || r.capType === "none") continue;
  const cap =
    r.capType === "percent" ? `${r.capPercent}% of rent`
    : r.capType === "flat" ? `$${r.capFlat}`
    : `${r.combine === "lesser" ? "Lesser" : "Greater"} of $${r.capFlat} or ${r.capPercent}%`;
  const grace = r.graceDays > 0 ? `${r.graceDays} days` : "None set";
  t2 += `| [${NAME.get(code)}](${BASE}/tools/late-fee-calculator/${SLUG.get(code)}) | ${cap} | ${grace} | ${r.cite.statute} |\n`;
}

/* ---- Table 3: rent increase notice, all 50 ---- */
let t3 = `| State | Minimum notice | Rent control? | Statute |\n|---|---|---|---|\n`;
for (const [code, r] of Object.entries(RENT_INCREASE)) {
  const extra = r.tiers?.length ? ` (up to ${Math.max(...r.tiers.map((t) => t.noticeDays))} in some cases)` : "";
  t3 += `| [${NAME.get(code)}](${BASE}/tools/rent-increase-notice-generator/${SLUG.get(code)}) | ${r.baseNoticeDays} days${extra} | ${r.rentControl === "none" ? "No" : r.rentControl} | ${r.cite.statute} |\n`;
}

/* ---- Table 4: deposit return deadlines, all 50 ---- */
let t4 = `| State | Return deadline | If deducting | Statute |\n|---|---|---|---|\n`;
for (const [code, r] of Object.entries(DEPOSIT_RETURN)) {
  t4 += `| [${NAME.get(code)}](${BASE}/tools/security-deposit-return-tracker/${SLUG.get(code)}) | ${r.deadlineDays} days | ${r.deadlineDaysIfDeducting ?? r.deadlineDays} days | ${r.cite.statute} |\n`;
}

write("_table-deposit-interest.md", t1);
write("_table-late-fees.md", t2);
write("_table-rent-increase.md", t3);
write("_table-deposit-return.md", t4);
console.log("Wrote 4 data tables to gtm/ (from verified data files).");
