import { describe, it, expect } from "vitest";
import { getObligations } from "./engine";
import { STATE_OBLIGATIONS, type ComplianceProfile, type Obligation } from "./obligations";

const base: ComplianceProfile = {
  state: "TX",
  city: null,
  entityType: "individual",
  usesContractors: false,
  builtPre1978: false,
  units: 1,
};

const JUN1 = new Date(2026, 5, 1); // 2026-06-01

describe("compliance engine — conditions", () => {
  it("always includes Schedule E and estimated taxes", () => {
    const ids = getObligations(base, JUN1).map((d) => d.obligation.id);
    expect(ids).toContain("fed-schedule-e");
    expect(ids).toContain("fed-estimated-tax");
  });

  it("includes 1099-NEC and W-9 only when usesContractors", () => {
    expect(getObligations(base, JUN1).map((d) => d.obligation.id)).not.toContain("fed-1099-nec");
    const withC = getObligations({ ...base, usesContractors: true }, JUN1).map((d) => d.obligation.id);
    expect(withC).toContain("fed-1099-nec");
    expect(withC).toContain("fed-w9");
  });
});

describe("compliance engine — date computation", () => {
  it("computes the next upcoming fixed date (Schedule E -> next Apr 15)", () => {
    const e = getObligations(base, JUN1).find((d) => d.obligation.id === "fed-schedule-e");
    expect(e?.nextDue).toBe("2027-04-15"); // Apr 15 2026 already passed by Jun 1
  });

  it("estimated taxes picks the nearest upcoming quarter", () => {
    const e = getObligations(base, JUN1).find((d) => d.obligation.id === "fed-estimated-tax");
    expect(e?.nextDue).toBe("2026-06-15"); // next quarterly date after Jun 1
  });

  it("`varies` items have no date and sort last", () => {
    const list = getObligations({ ...base, usesContractors: true }, JUN1);
    const w9 = list.find((d) => d.obligation.id === "fed-w9");
    expect(w9?.nextDue).toBeNull();
    expect(list.at(-1)?.nextDue).toBeNull();
  });

  it("CA LLC sees the franchise tax, 568, and Statement of Information", () => {
    const ids = getObligations({ ...base, state: "CA", entityType: "llc", llcFormationDate: "2021-07-10" }, JUN1)
      .map((d) => d.obligation.id);
    expect(ids).toContain("ca-franchise-tax");
    expect(ids).toContain("ca-form-568");
    expect(ids).toContain("ca-statement-of-information");
  });

  it("LA Rent Registry applies only to pre-1978 buildings", () => {
    const newer = getObligations({ ...base, state: "CA", city: "los-angeles", builtPre1978: false }, JUN1)
      .map((d) => d.obligation.id);
    expect(newer).not.toContain("la-rent-registry");
    const older = getObligations({ ...base, state: "CA", city: "los-angeles", builtPre1978: true }, JUN1)
      .map((d) => d.obligation.id);
    expect(older).toContain("la-rent-registry");
  });

  it("MD lead registration applies to pre-1978 rentals, due Dec 31", () => {
    const md = getObligations({ ...base, state: "MD", builtPre1978: true }, JUN1)
      .find((d) => d.obligation.id === "md-lead-registration");
    expect(md?.nextDue).toBe("2026-12-31");
  });

  it("Chicago has the RLTO summary item (varies, no date), not a registration deadline", () => {
    const chi = getObligations({ ...base, state: "IL", city: "chicago" }, JUN1);
    const rlto = chi.find((d) => d.obligation.id === "chicago-rlto-summary");
    expect(rlto).toBeTruthy();
    expect(rlto?.nextDue).toBeNull();
  });

  it("anniversary item needs a formation date, else null", () => {
    const annual: Obligation = {
      id: "test-anniv", jurisdiction: "state", scope: "ZZ", title: "t", what: "w",
      fileWith: "x", dueType: "anniversary", anchorField: "llcFormationDate",
      everyYears: 2, conditions: [{ type: "entity", value: "llc" }],
      cite: { statute: "s", lastVerified: "2026-06-15", confidence: "high" }, sources: [],
    };
    STATE_OBLIGATIONS.ZZ = [annual];
    const noDate = getObligations({ ...base, state: "ZZ", entityType: "llc" }, JUN1);
    expect(noDate.find((d) => d.obligation.id === "test-anniv")?.nextDue).toBeNull();
    const withDate = getObligations(
      { ...base, state: "ZZ", entityType: "llc", llcFormationDate: "2020-09-10" },
      JUN1,
    );
    // biennial from 2020 -> 2026 is on cycle; Sep 10 2026 is upcoming
    expect(withDate.find((d) => d.obligation.id === "test-anniv")?.nextDue).toBe("2026-09-10");
    delete STATE_OBLIGATIONS.ZZ;
  });
});
