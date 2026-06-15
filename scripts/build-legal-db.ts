/**
 * Generates the unified legal database at /data/legal/ from the CANONICAL
 * per-topic datasets in src/tools/<topic>/data.ts. This keeps one source of
 * truth (the typed, tested TS modules) and emits portable JSON the site can
 * consume via src/lib/legal-db.ts.
 *
 * Run: npm run build:legal
 * Also writes LEGAL-REVIEW.md — the human spot-check checklist (flags every
 * low/medium/unverified field grouped by state and category).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { US_STATES } from "../src/lib/states.ts";
import { DEPOSIT_RETURN } from "../src/tools/security-deposit-return/data.ts";
import { LATE_FEE } from "../src/tools/late-fee/data.ts";
import { RENT_INCREASE } from "../src/tools/rent-increase-notice/data.ts";
import { DEPOSIT_INTEREST } from "../src/tools/security-deposit-interest/data.ts";
import { DEPOSIT_LIMIT } from "../src/tools/security-deposit-limit/data.ts";

type Conf = "high" | "medium" | "low" | "unverified";
interface Cite { statute: string; statuteUrl?: string; lastVerified: string; confidence: Conf }
interface Field<T> {
  value: T | null; statute: string | null; statuteUrl: string | null;
  lastVerified: string | null; confidence: Conf; sources: string[]; notes?: string;
}

const UNVERIFIED: Field<never> = {
  value: null, statute: null, statuteUrl: null, lastVerified: null,
  confidence: "unverified", sources: [],
  notes: "Not yet researched — needs 2-source verification.",
};

function fld<T>(value: T, cite: Cite, sources: string[] = [], notes?: string): Field<T> {
  return {
    value,
    statute: cite.statute,
    statuteUrl: cite.statuteUrl ?? null,
    lastVerified: cite.lastVerified,
    confidence: cite.confidence,
    sources: sources.length ? sources : cite.statuteUrl ? [cite.statuteUrl] : [],
    ...(notes ? { notes } : {}),
  };
}

const NAME = new Map(US_STATES.map((s) => [s.code, s.name]));
const SLUG = new Map(US_STATES.map((s) => [s.code, s.slug]));

function lateFeeSummary(r: (typeof LATE_FEE)[string]): string {
  switch (r.capType) {
    case "percent": return `Up to ${r.capPercent}% of rent`;
    case "flat": return `Up to $${r.capFlat}`;
    case "percent_or_flat":
      return `${r.combine === "greater" ? "Greater" : "Lesser"} of $${r.capFlat} or ${r.capPercent}% of rent`;
    default: return "No statutory cap (must be reasonable)";
  }
}

function buildState(code: string) {
  const dr = DEPOSIT_RETURN[code];
  const lf = LATE_FEE[code];
  const ri = RENT_INCREASE[code];
  const di = DEPOSIT_INTEREST[code];
  const dl = DEPOSIT_LIMIT[code];

  const rec = {
    state: code,
    name: NAME.get(code)!,
    securityDeposit: {
      maxLimit: dl ? fld(dl.summary, dl.cite, dl.sources) : UNVERIFIED,
      returnDeadlineDays: dr ? fld(dr.deadlineDays, dr.cite) : UNVERIFIED,
      returnDeadlineIfDeductingDays:
        dr && dr.deadlineDaysIfDeducting != null
          ? fld(dr.deadlineDaysIfDeducting, dr.cite)
          : UNVERIFIED,
      itemizationRequired: dr ? fld(dr.itemization, dr.cite) : UNVERIFIED,
      interestRequired: di ? fld(di.required === "yes", di.cite) : UNVERIFIED,
      interestSummary: di ? fld(di.summary, di.cite) : UNVERIFIED,
    },
    notice: {
      entryHours: UNVERIFIED, // category not yet researched
      rentIncreaseDays: ri ? fld(ri.baseNoticeDays, ri.cite, [], ri.controlNote ?? ri.notes) : UNVERIFIED,
      terminationDays: UNVERIFIED, // category not yet researched
    },
    lateFee: {
      capSummary: lf ? fld(lateFeeSummary(lf), lf.cite, [], lf.notes) : UNVERIFIED,
      graceDays: lf ? fld(lf.graceDays, lf.cite) : UNVERIFIED,
    },
    disclosures: UNVERIFIED, // category not yet researched
    habitability: UNVERIFIED, // category not yet researched
    rentReceipt: UNVERIFIED, // category not yet researched
    lastVerified: null as string | null,
  };

  // lastVerified = most recent verified date across fields
  const dates: string[] = [];
  const walk = (o: unknown) => {
    if (o && typeof o === "object") {
      if ("lastVerified" in o && (o as Field<unknown>).lastVerified && (o as Field<unknown>).confidence !== "unverified")
        dates.push((o as Field<unknown>).lastVerified as string);
      else Object.values(o as Record<string, unknown>).forEach(walk);
    }
  };
  walk(rec.securityDeposit); walk(rec.notice); walk(rec.lateFee);
  rec.lastVerified = dates.sort().at(-1) ?? null;
  return rec;
}

// ---- Generate ----
const OUT = new URL("../data/legal/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const all: Record<string, ReturnType<typeof buildState>> = {};
for (const { code } of US_STATES) {
  const rec = buildState(code);
  all[code] = rec;
  writeFileSync(new URL(`${SLUG.get(code)}.json`, OUT), JSON.stringify(rec, null, 2));
}
writeFileSync(new URL("db.json", OUT), JSON.stringify(all, null, 2));

// ---- Coverage + index ----
const CATEGORIES = [
  ["securityDeposit.maxLimit", "Deposit max limit"],
  ["securityDeposit.returnDeadlineDays", "Deposit return deadline"],
  ["securityDeposit.itemizationRequired", "Deposit itemization"],
  ["securityDeposit.interestRequired", "Deposit interest"],
  ["notice.entryHours", "Entry notice"],
  ["notice.rentIncreaseDays", "Rent increase notice"],
  ["notice.terminationDays", "Termination notice"],
  ["lateFee.capSummary", "Late fee cap"],
  ["disclosures", "Required disclosures"],
  ["habitability", "Habitability"],
  ["rentReceipt", "Rent receipt rules"],
] as const;

const get = (rec: Record<string, unknown>, path: string): Field<unknown> =>
  path.split(".").reduce((o: Record<string, unknown>, k) => o[k] as Record<string, unknown>, rec) as unknown as Field<unknown>;

const counts: Record<string, Record<Conf, number>> = {};
for (const [path] of CATEGORIES) {
  counts[path] = { high: 0, medium: 0, low: 0, unverified: 0 };
  for (const code of Object.keys(all)) counts[path][get(all[code], path).confidence]++;
}

writeFileSync(new URL("index.json", OUT), JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  states: Object.keys(all).length,
  categories: CATEGORIES.map(([path, label]) => ({ path, label, ...counts[path] })),
}, null, 2));

// ---- LEGAL-REVIEW.md ----
const flagged: string[] = [];
for (const code of Object.keys(all)) {
  const rows: string[] = [];
  for (const [path, label] of CATEGORIES) {
    const f = get(all[code], path);
    if (f.confidence === "high") continue;
    const mark = f.confidence === "unverified" ? "needs research"
      : `**${f.confidence}** — \`${f.statute}\` (verified ${f.lastVerified})`;
    rows.push(`  - [ ] ${label}: ${mark}`);
  }
  if (rows.length) flagged.push(`\n### ${all[code].name} (${code})\n${rows.join("\n")}`);
}

const totalHigh = CATEGORIES.reduce((n, [p]) => n + counts[p].high, 0);
const totalFields = CATEGORIES.length * Object.keys(all).length;

const md = `# Legal data review — spot-check checklist

> Auto-generated by \`npm run build:legal\`. Re-run after editing any
> \`src/tools/*/data.ts\`. **high** = cross-checked against the cited statute.
> Clear **unverified** (needs research) and spot-check **low/medium** before
> promoting the related tool. ${totalHigh}/${totalFields} fields are high-confidence.

## Coverage by category
| Category | high | medium | low | unverified |
|---|---|---|---|---|
${CATEGORIES.map(([p, l]) => `| ${l} | ${counts[p].high} | ${counts[p].medium} | ${counts[p].low} | ${counts[p].unverified} |`).join("\n")}

## Flagged by state
${flagged.join("\n")}
`;
writeFileSync(new URL("../LEGAL-REVIEW.md", import.meta.url), md);

console.log(`Wrote ${Object.keys(all).length} state files + db.json + index.json. ${totalHigh}/${totalFields} fields high-confidence.`);
