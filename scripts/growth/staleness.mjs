/**
 * Legal-data staleness checker. Flags verified fields whose lastVerified date
 * is older than the window (default 180 days) — the re-verification queue —
 * plus a coverage summary and the states closest to unlocking a /laws hub.
 *
 * Usage: node scripts/growth/staleness.mjs [--days=180]
 */
import { readFileSync } from "node:fs";

const days = Number((process.argv.find((a) => a.startsWith("--days=")) ?? "--days=180").split("=")[1]);
const db = JSON.parse(readFileSync("data/legal/db.json", "utf8"));
const cutoff = Date.now() - days * 86400_000;

const FIELDS = (r) => [
  ["deposit max", r.securityDeposit.maxLimit],
  ["return deadline", r.securityDeposit.returnDeadlineDays],
  ["return w/ deductions", r.securityDeposit.returnDeadlineIfDeductingDays],
  ["itemization", r.securityDeposit.itemizationRequired],
  ["interest required", r.securityDeposit.interestRequired],
  ["interest rule", r.securityDeposit.interestSummary],
  ["entry notice", r.notice.entryHours],
  ["rent-increase notice", r.notice.rentIncreaseDays],
  ["termination notice", r.notice.terminationDays],
  ["late-fee cap", r.lateFee.capSummary],
  ["grace days", r.lateFee.graceDays],
  ["disclosures", r.disclosures],
  ["habitability", r.habitability],
  ["rent receipt", r.rentReceipt],
];

const stale = [];
let high = 0, medium = 0, low = 0, unverified = 0;
const hubCount = {};
for (const rec of Object.values(db)) {
  let verified = 0;
  for (const [label, f] of FIELDS(rec)) {
    if (f.confidence === "high") high++;
    else if (f.confidence === "medium") medium++;
    else if (f.confidence === "low") low++;
    else unverified++;
    if ((f.confidence === "high" || f.confidence === "medium") && f.value != null) {
      verified++;
      if (f.lastVerified && new Date(f.lastVerified).getTime() < cutoff) {
        stale.push({ state: rec.name, label, date: f.lastVerified, conf: f.confidence });
      }
    }
  }
  hubCount[rec.name] = verified;
}

console.log(`Coverage: ${high} high · ${medium} medium · ${low} low · ${unverified} unverified (of ${high + medium + low + unverified})`);
console.log(`Hub states (>=4 verified): ${Object.values(hubCount).filter((n) => n >= 4).length}/51`);

const near = Object.entries(hubCount).filter(([, n]) => n === 3).map(([n]) => n);
if (near.length) console.log(`One field from a hub: ${near.join(", ")} ← best research targets (recipe: OPERATIONS.md §6)`);

if (stale.length) {
  console.log(`\nSTALE (> ${days} days since verification) — re-verify these:`);
  for (const s of stale.sort((a, b) => a.date.localeCompare(b.date))) {
    console.log(`  ${s.date}  ${s.state} — ${s.label} (${s.conf})`);
  }
  console.log(`\nAfter re-verifying: update the data file dates, run 'npm run build:legal', then 'node scripts/gtm-tables.mjs'.`);
  process.exit(2);
} else {
  console.log(`\nNo verified fields older than ${days} days. ✅`);
}
