import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

/**
 * Minimal, dependency-light document builder on top of pdf-lib. Produces clean,
 * professional US-Letter PDFs entirely in the browser (zero server compute).
 *
 * Free-tier output carries a small "Made with LandlordKit" footer; passing
 * `pro: true` (and optional branding) removes it — this is the upgrade hook.
 */
export type Block =
  | { type: "title"; text: string }
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "right"; text: string } // right-aligned line (e.g. date)
  | { type: "spacer"; size?: number }
  | { type: "rule" }
  | { type: "pageBreak" } // force the next block onto a fresh page
  | { type: "signature"; label: string }; // signature line + label

export interface BuildDocOptions {
  blocks: Block[];
  pro?: boolean;
  /** Pro branding line shown in the footer instead of the watermark. */
  brandingLine?: string;
}

const PAGE = { w: 612, h: 792 };
const MARGIN = 72;
const CONTENT_W = PAGE.w - MARGIN * 2;
const INK = rgb(0.08, 0.13, 0.11);
const MUTED = rgb(0.45, 0.45, 0.45);

// The standard PDF fonts only encode WinAnsi (cp1252). A CJK/Cyrillic/emoji
// character would make pdf-lib THROW, crashing document generation. We replace
// any unencodable character with "?" so a tenant/landlord with a non-Latin name
// still gets a working PDF. (Full Unicode would require embedding a font.)
const _encodable = new Map<string, boolean>();
function isEncodable(font: PDFFont, ch: string): boolean {
  let v = _encodable.get(ch);
  if (v === undefined) {
    try {
      // encodeText (not widthOfTextAtSize) is what throws on unencodable chars.
      font.encodeText(ch);
      v = true;
    } catch {
      v = false;
    }
    _encodable.set(ch, v);
  }
  return v;
}

function sanitizeLine(text: string, font: PDFFont): string {
  let out = "";
  for (const ch of text) out += ch === " " || isEncodable(font, ch) ? ch : "?";
  return out;
}

function wrapText(text: string, font: PDFFont, size: number, maxW: number) {
  const lines: string[] = [];
  for (const rawLine of text.split("\n")) {
    const words = sanitizeLine(rawLine, font).split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let line = "";
    for (let word of words) {
      // Hard-break a single token longer than the content width (e.g. a
      // 1000-char name or a long URL) so it can't run off the page edge.
      while (font.widthOfTextAtSize(word, size) > maxW && word.length > 1) {
        let i = 1;
        while (i < word.length && font.widthOfTextAtSize(word.slice(0, i + 1), size) <= maxW) i++;
        if (line) {
          lines.push(line);
          line = "";
        }
        lines.push(word.slice(0, i));
        word = word.slice(i);
      }
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxW && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

export async function buildDocumentPdf(
  opts: BuildDocOptions,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const body = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = doc.addPage([PAGE.w, PAGE.h]);
  let y = PAGE.h - MARGIN;
  let pageHasContent = false;

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN + 40) {
      page = doc.addPage([PAGE.w, PAGE.h]);
      y = PAGE.h - MARGIN;
      pageHasContent = false;
    }
    pageHasContent = true;
  };

  const drawLines = (
    text: string,
    font: PDFFont,
    size: number,
    gap: number,
    align: "left" | "right" = "left",
  ) => {
    for (const line of wrapText(text, font, size, CONTENT_W)) {
      ensureSpace(size + gap);
      const x =
        align === "right"
          ? PAGE.w - MARGIN - font.widthOfTextAtSize(line, size)
          : MARGIN;
      page.drawText(line, { x, y, size, font, color: INK });
      y -= size + gap;
    }
  };

  for (const block of opts.blocks) {
    switch (block.type) {
      case "title":
        drawLines(block.text, bold, 18, 8);
        break;
      case "heading":
        y -= 6;
        drawLines(block.text, bold, 12, 5);
        break;
      case "paragraph":
        drawLines(block.text, body, 11, 5);
        y -= 6;
        break;
      case "right":
        drawLines(block.text, body, 11, 5, "right");
        break;
      case "spacer":
        y -= block.size ?? 16;
        break;
      case "pageBreak":
        // Start a fresh page, but never emit a leading blank one.
        if (pageHasContent) {
          page = doc.addPage([PAGE.w, PAGE.h]);
          y = PAGE.h - MARGIN;
          pageHasContent = false;
        }
        break;
      case "rule":
        ensureSpace(12);
        page.drawLine({
          start: { x: MARGIN, y },
          end: { x: PAGE.w - MARGIN, y },
          thickness: 0.75,
          color: rgb(0.85, 0.83, 0.78),
        });
        y -= 12;
        break;
      case "signature":
        y -= 24;
        ensureSpace(28);
        page.drawLine({
          start: { x: MARGIN, y },
          end: { x: MARGIN + 240, y },
          thickness: 0.75,
          color: INK,
        });
        y -= 14;
        page.drawText(sanitizeLine(block.label, body), { x: MARGIN, y, size: 9, font: body, color: MUTED });
        y -= 14;
        break;
    }
  }

  // Footer on every page.
  const pages = doc.getPages();
  const footer =
    opts.pro && opts.brandingLine
      ? opts.brandingLine
      : opts.pro
        ? ""
        : "Made with LandlordKit — free landlord tools at landlordkit.com";
  if (footer) {
    const safeFooter = sanitizeLine(footer, body);
    for (const p of pages) {
      p.drawText(safeFooter, {
        x: MARGIN,
        y: MARGIN - 28,
        size: 8,
        font: body,
        color: MUTED,
      });
    }
  }

  return doc.save();
}

/** Triggers a browser download of PDF bytes. Client-side only. */
export function downloadPdf(bytes: Uint8Array, filename: string): void {
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([ab], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
