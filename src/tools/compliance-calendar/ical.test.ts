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

  it("adds no alarms by default (download export stays clean)", () => {
    expect(ics).not.toContain("BEGIN:VALARM");
  });
});

describe("buildIcs with reminder alarms (feed)", () => {
  const ics = buildIcs(getObligations(profile, today), [], today, [7, 1]);

  it("attaches a VALARM per requested lead time on each event", () => {
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("TRIGGER:-P7D");
    expect(ics).toContain("TRIGGER:-P1D");
    expect(ics).toContain("ACTION:DISPLAY");
    // Two alarms per event → even count, and at least one event's worth.
    const alarms = (ics.match(/BEGIN:VALARM/g) || []).length;
    expect(alarms).toBeGreaterThanOrEqual(2);
    expect(alarms % 2).toBe(0);
  });
});
