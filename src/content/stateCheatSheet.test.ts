import { describe, it, expect } from "vitest";
import { buildDocumentPdf } from "@/lib/pdf/pdfDoc";
import { buildStateCheatSheet } from "./stateCheatSheet";

describe("state cheat sheet lead magnet", () => {
  it("builds a clean PDF for a well-covered state (MA)", async () => {
    const blocks = buildStateCheatSheet("MA", "Massachusetts");
    expect(blocks).not.toBeNull();
    const text = JSON.stringify(blocks);
    // No leaked placeholders and the honesty/disclaimer language present.
    expect(text).not.toMatch(/undefined|NaN/);
    expect(text).toContain("not legal advice");
    expect(text).toContain("last verified");
    const bytes = await buildDocumentPdf({ blocks: blocks!, pro: false });
    expect(bytes.length).toBeGreaterThan(1000);
  });

  it("only includes verified fields (unverified listed as pending)", () => {
    const blocks = buildStateCheatSheet("MA", "Massachusetts")!;
    const text = JSON.stringify(blocks);
    expect(text).toContain("verification queue");
  });

  it("returns null for an unknown state code", () => {
    expect(buildStateCheatSheet("ZZ", "Nowhere")).toBeNull();
  });
});
