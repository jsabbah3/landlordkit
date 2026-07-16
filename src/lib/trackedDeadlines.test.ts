import { describe, it, expect } from "vitest";
import { mergeCustom, trackedDeadlineId } from "./trackedDeadlines";
import type { CustomDeadline } from "@/tools/compliance-calendar/ical";

const d = (id: string, date = "2026-08-01"): CustomDeadline => ({
  id,
  title: `Deadline ${id}`,
  date,
  recurrence: "once",
});

describe("tracked deadlines", () => {
  it("appends a new deadline", () => {
    const out = mergeCustom([d("a")], d("b"));
    expect(out.map((x) => x.id)).toEqual(["a", "b"]);
  });

  it("replaces (dedupes) by id rather than duplicating", () => {
    const out = mergeCustom([d("a", "2026-08-01")], d("a", "2026-09-15"));
    expect(out).toHaveLength(1);
    expect(out[0].date).toBe("2026-09-15");
  });

  it("builds a stable, slug-safe id from kind + key + date", () => {
    const id = trackedDeadlineId("deposit-return", "California / Jane Doe", "2026-08-01");
    expect(id).toBe("deposit-return-california-jane-doe-2026-08-01");
    // re-tracking the same obligation yields the same id (so it updates)
    expect(trackedDeadlineId("deposit-return", "California / Jane Doe", "2026-08-01")).toBe(id);
  });
});
