import { US_STATES } from "@/lib/states";
import { DEPOSIT_INTEREST } from "@/tools/security-deposit-interest/data";

export const dynamic = "force-static";

/** Raw-data download for the 2026 deposit-interest report — the citable
 *  artifact for journalists/researchers. Generated from the verified data
 *  files so it always matches the live site. */
export function GET() {
  const NAME = new Map(US_STATES.map((s) => [s.code, s.name]));
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const rows = [
    ["state", "interest_required", "rate_basis", "rate_pct", "min_holding_months", "applies_to", "summary", "statute", "last_verified"].join(","),
  ];
  for (const [code, r] of Object.entries(DEPOSIT_INTEREST)) {
    rows.push([
      esc(NAME.get(code) ?? code),
      r.required,
      r.rateBasis,
      r.defaultRatePct ?? "",
      r.minHoldingMonths,
      esc(r.appliesTo ?? ""),
      esc(r.summary),
      esc(r.cite.statute),
      r.cite.lastVerified,
    ].join(","));
  }
  return new Response(rows.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="landlordkit-deposit-interest-2026.csv"',
    },
  });
}
