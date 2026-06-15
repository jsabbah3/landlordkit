# LandlordKit — Hostile QA Report

Date: 2026-06-15 · Tester: adversarial QA pass (forms, links, schema, a11y,
mobile, analytics, legal-data consistency). Defects ranked by severity, each
with status. Fixes verified by re-test.

## Summary
- **1 critical defect found and FIXED** (PDF crash on non-Latin input).
- **2 medium defects found** (1 fixed, 1 partially mitigated).
- **2 low items** (noted, see decisions).
- **Passed:** internal links, finance-calc edge cases, mobile overflow, schema
  blocks, analytics wiring, legal-data consistency.

## Defects (ranked)

### 🔴 CRITICAL — PDF generation crashed on non-Latin characters — FIXED
Any tenant/landlord/property value containing CJK, Cyrillic, emoji, or other
non-WinAnsi characters made `pdf-lib` throw `WinAnsi cannot encode "…"`. Because
each tool's `handleDownloadPdf` is an un-caught async handler, the result was a
**silent failure**: no PDF, no error message. Affected **all 5 document tools**
(rent receipt, lease renewal, rent increase notice, deposit interest statement,
deposit return statement). Reproduced in Node and in-browser (download never
fired for "李明 🏠 Иван").

**Fix** (`src/lib/pdf/pdfDoc.ts`): added `isEncodable()` (probes the font with
`encodeText`, cached) + `sanitizeLine()` that replaces unencodable characters
with `?`, applied to every drawn string — the wrapped body text, the signature
label (was drawn directly), and the footer/Pro branding line.
**Re-test:** all 5 hostile strings now produce a valid PDF; in-browser download
with CJK+emoji+Cyrillic name succeeds and fires `pdf_downloaded`.
**Residual:** non-Latin names show as `?` placeholders — see Decision #1.

### 🟠 MEDIUM — Long unbroken strings overflowed the PDF page — FIXED
A 1000-char name (or a long URL/email with no spaces) ran off the right page
edge because `wrapText` only broke on whitespace.
**Fix:** `wrapText` now hard-breaks any token wider than the content width into
fitting chunks. **Re-test:** 1000-char input wraps cleanly (1117 → 1406 bytes,
multi-line).

### 🟠 MEDIUM — PDF download failures give no user feedback — PARTIALLY MITIGATED
The encoding crash (the common trigger) is now eliminated, so the realistic
failure path is closed. But the 5 `handleDownloadPdf` handlers still have no
`try/catch` + UI message, so any *other* future failure would still fail
silently. **Recommended follow-up** (low effort): wrap each in try/catch and
show an inline error. Not blocking; deferred to keep this pass focused.

### 🟡 LOW — Live-compute tools don't emit `tool_used` — OPEN
Button-triggered calculators fire `tool_used`; the reactive ones (prorated rent,
cash flow) compute on input change and never fire it, so their usage is
invisible in analytics. Minor funnel-visibility gap. Easy to add later.

### 🟡 LOW / INFO — Analytics providers not yet loaded — EXPECTED
`track()` fires correctly (verified: `pdf_downloaded`), but no GA4/Plausible
script loads until `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set —
so events currently go nowhere in production. Config-gated by design; see
Decision #3.

## What passed (tested, no defect)
- **Internal links:** every referenced root (`/`, `/tools`, `/guides`,
  `/pricing`, `/account`, `/disclaimer`, `/privacy`, `/terms`) resolves; no `#`
  or empty hrefs; cross-tool state links generate for all states.
- **Finance calc edge cases:** cap rate, cash-on-cash, and mortgage all guard
  their denominators (price>0, cashInvested>0, term>0); prorated rent clamps
  days ≥ 1. `$0` rent, negatives, and NaN produce `$0.00`, never `NaN`/`Infinity`.
- **Mobile (375px):** zero horizontal overflow on every page checked; hamburger
  nav works; date inputs stack.
- **Schema blocks:** FAQ / HowTo / SoftwareApplication / BreadcrumbList render
  as valid JSON (serialized via `JSON.stringify`).
- **Analytics wiring:** all 6 events present in code; `pdf_downloaded` confirmed
  firing in-browser.
- **Legal-data consistency:** state pages read from the canonical per-topic TS
  modules, which are the same source `/data/legal/` is generated from — so the
  displayed values match the DB by construction.

## Not fully re-tested this pass (prior status holds)
- **Lighthouse / Core Web Vitals:** verified 95+ mobile in a prior session. The
  PDF fix is in a dynamically-imported module (loaded only on download), so it
  does not affect page CWV. Re-run Lighthouse after the next deploy to confirm.
- **Deep accessibility (axe) audit:** Lighthouse a11y was 95–97 earlier; labels
  and ARIA are present. A dedicated axe pass wasn't repeated here.

## Decisions needed from a human — see end of session summary.
