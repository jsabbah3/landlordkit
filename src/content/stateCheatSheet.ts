/**
 * Per-state "Landlord Law Cheat Sheet" lead magnet — PDF blocks generated
 * from the unified legal DB. Only verified (high/medium) fields are included;
 * unverified areas are listed honestly. Zero server cost: rendered client-side
 * with the existing pdfDoc builder at download time.
 */
import type { Block } from "@/lib/pdf/pdfDoc";
import { getStateLegal, type Field } from "@/lib/legal-db";

const ok = (f: Field<unknown>) =>
  (f.confidence === "high" || f.confidence === "medium") && f.value != null;

const line = (label: string, f: Field<unknown>, fmt: (v: unknown) => string): Block[] =>
  ok(f)
    ? [
        { type: "heading", text: `${label}: ${fmt(f.value)}` },
        {
          type: "paragraph",
          text: `${f.statute ?? ""}${f.lastVerified ? ` — last verified ${f.lastVerified.slice(0, 10)}` : ""}${f.notes ? `. ${f.notes}` : ""}`,
        },
      ]
    : [];

const days = (v: unknown) => `${v} day${v === 1 ? "" : "s"}`;
const yesNo = (v: unknown) => (v ? "Yes" : "No");
const str = (v: unknown) => String(v);

export function buildStateCheatSheet(code: string, stateName: string): Block[] | null {
  const r = getStateLegal(code);
  if (!r) return null;

  const blocks: Block[] = [
    { type: "title", text: `${stateName} Landlord Law Cheat Sheet` },
    { type: "right", text: `getlandlordkit.com/laws — ${new Date().getFullYear()} edition` },
    { type: "rule" },
    {
      type: "paragraph",
      text: "Every value below cites its statute and the date we last verified it. Rules we haven't verified are listed at the end — we never guess at the law. General information, not legal advice.",
    },
    { type: "spacer", size: 6 },
  ];

  blocks.push(
    ...line("Maximum security deposit", r.securityDeposit.maxLimit, str),
    ...line("Deposit return deadline", r.securityDeposit.returnDeadlineDays, days),
    ...line("Return deadline when deducting", r.securityDeposit.returnDeadlineIfDeductingDays, days),
    ...line("Itemized statement required", r.securityDeposit.itemizationRequired, yesNo),
    ...line("Interest owed on deposits", r.securityDeposit.interestRequired, yesNo),
    ...line("Interest rule", r.securityDeposit.interestSummary, str),
    ...line("Late fee limit", r.lateFee.capSummary, str),
    ...line("Late fee grace period", r.lateFee.graceDays, days),
    ...line("Rent increase notice", r.notice.rentIncreaseDays, days),
    ...line("Month-to-month termination notice", r.notice.terminationDays, days),
  );

  const pending: string[] = [];
  if (!ok(r.notice.entryHours)) pending.push("entry notice");
  if (!ok(r.notice.terminationDays)) pending.push("termination notice");
  if (!ok(r.disclosures)) pending.push("required disclosures");
  if (!ok(r.habitability)) pending.push("habitability standards");
  if (!ok(r.rentReceipt)) pending.push("rent receipt rules");
  if (pending.length) {
    blocks.push(
      { type: "spacer", size: 8 },
      { type: "rule" },
      {
        type: "paragraph",
        text: `In our verification queue for ${stateName} (not yet published): ${pending.join(", ")}. Watch getlandlordkit.com/laws for updates.`,
      },
    );
  }

  blocks.push(
    { type: "spacer", size: 6 },
    {
      type: "paragraph",
      text: "Free calculators for each rule (with worked examples for your numbers): getlandlordkit.com/tools",
    },
  );
  return blocks;
}
