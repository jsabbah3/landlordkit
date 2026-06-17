import { describe, it, expect } from "vitest";
import { buildIcs } from "./ical";
import { getObligations } from "./engine";
import type { ComplianceProfile } from "./obligations";

const profile: ComplianceProfile = {
  state: "NY", city: "new-york-city", entityType: "llc",
  llcFormationDate: "2021-03-10", usesContractors: true, builtPre1978: false, units: 6,
};
const today = new Date(2026, 5, 1);

describe("buildIcs", () => {
  const ics = buildIcs(getObligations(profile, today), [
    { id: "x1", title: "Chicago rental reg", date: "2027-03-01", recurrence: "annual" },
  ], today);

  it("produces a valid VCALENDAR wrapper", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
  });

  it("includes the NYC HPD Sept 1 event with yearly recurrence", () => {
    expect(ics).toContain("DTSTART;VALUE=DATE:20260901");
    expect(ics).toMatch(/SUMMARY:Register your property with NYC HPD/);
    expect(ics).toContain("RRULE:FREQ=YEARLY");
  });

  it("expands all 4 quarterly estimated-tax dates", () => {
    const count = (ics.match(/fed-estimated-tax-/g) || []).length;
    expect(count).toBe(4);
  });

  it("recurs the NY biennial statement every 2 years", () => {
    expect(ics).toContain("RRULE:FREQ=YEARLY;INTERVAL=2");
  });

  it("includes the custom deadline and escapes nothing dangerous", () => {
    expect(ics).toContain("SUMMARY:Chicago rental reg");
  });

  it("omits undated `varies` items (W-9)", () => {
    expect(ics).not.toContain("Collect W-9s");
  });
});
