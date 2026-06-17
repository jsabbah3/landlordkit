import { describe, it, expect } from "vitest";
import { mergeProfile, hasProfile } from "./profile";

describe("mergeProfile", () => {
  it("overlays new values onto the base", () => {
    expect(mergeProfile({ landlordName: "A" }, { tenantName: "B" })).toEqual({
      landlordName: "A",
      tenantName: "B",
    });
  });

  it("never wipes a stored field with a blank/whitespace value", () => {
    const out = mergeProfile({ landlordName: "Jane" }, { landlordName: "", tenantName: "  " });
    expect(out.landlordName).toBe("Jane");
    expect(out.tenantName).toBeUndefined();
  });

  it("overwrites when a real new value is provided", () => {
    expect(mergeProfile({ monthlyRent: "2000" }, { monthlyRent: "2100" }).monthlyRent).toBe("2100");
  });

  it("coerces values to strings", () => {
    expect(mergeProfile({}, { monthlyRent: 1500 as unknown as string }).monthlyRent).toBe("1500");
  });
});

describe("hasProfile", () => {
  it("is false for empty/blank-only records", () => {
    expect(hasProfile({})).toBe(false);
    expect(hasProfile({ landlordName: "", tenantName: "  " })).toBe(false);
  });
  it("is true once any real value exists", () => {
    expect(hasProfile({ propertyAddress: "123 Main St" })).toBe(true);
  });
});
