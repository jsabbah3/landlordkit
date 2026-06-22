import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { buildDocumentPdf } from "./pdfDoc";

/**
 * Regression guard for the QA-found critical defect: pdf-lib's standard fonts
 * only encode WinAnsi, so non-Latin characters used to crash PDF generation.
 * sanitizeLine() must keep these inputs from throwing.
 */
describe("buildDocumentPdf — hostile input never crashes", () => {
  const hostile = [
    ["CJK", "李明 (Li Ming)"],
    ["emoji", "Apt 🏠 #2"],
    ["Cyrillic", "Иван Петров"],
    ["smart quotes/dash", "The “Smith” lease — unit #3"],
    ["1000-char unbroken token", "A".repeat(1000)],
    ["empty", ""],
  ] as const;

  for (const [label, value] of hostile) {
    it(`handles ${label}`, async () => {
      const bytes = await buildDocumentPdf({
        blocks: [
          { type: "title", text: `Receipt for ${value}` },
          { type: "paragraph", text: `To: ${value}` },
          { type: "signature", label: `${value} — Landlord` },
        ],
        pro: false,
      });
      expect(bytes.length).toBeGreaterThan(0);
    });
  }
});

describe("buildDocumentPdf — pageBreak (batch generation)", () => {
  it("puts each section on its own page", async () => {
    const bytes = await buildDocumentPdf({
      blocks: [
        { type: "title", text: "Receipt 1" },
        { type: "pageBreak" },
        { type: "title", text: "Receipt 2" },
        { type: "pageBreak" },
        { type: "title", text: "Receipt 3" },
      ],
      pro: true,
    });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(3);
  });

  it("never emits a leading blank page from a leading break", async () => {
    const bytes = await buildDocumentPdf({
      blocks: [
        { type: "pageBreak" },
        { type: "title", text: "Only receipt" },
      ],
      pro: true,
    });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });
});
