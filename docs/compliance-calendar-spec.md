# Spec: LandlordKit Compliance Calendar (Pro)

Status: **DRAFT — awaiting sign-off.** No code until approved.
Owner: Jake · Drafted: 2026-06-15

## 1. What it is
A personalized recurring-deadline tracker for landlords. The landlord fills out
a short profile once; we generate their list of filing/compliance obligations
with due dates, let them add their own, and export everything to their calendar
(iCal). Every system-provided obligation is cited + confidence-flagged +
last-verified, like the legal DB. **Not legal/tax advice** (disclaimer on page).

This is LandlordKit's first **stateful, account-bound** feature — the saved
profile is the point, and it's what justifies a recurring subscription.

## 2. Positioning (freemium)
- **Free (SEO + lead magnet):** a static guide, `/guides/landlord-compliance-deadlines`,
  covering the *uniform federal* deadlines. No personalization, no save, no export.
- **Pro:** the personalized, **saved**, **state/city-aware**, **iCal-exportable**
  calendar with custom deadlines and "mark done this year." The personalization
  + persistence is the paywall line — never a paywall on the free info.

## 3. User flow
1. Visit `/tools/compliance-calendar`.
2. Not signed in → see a teaser (the federal items, blurred/locked personalization)
   + "Sign in to build your calendar."
3. Signed in → fill/edit **profile** (saved to Supabase).
4. See generated **obligations list**, sorted by next due date, each with: title,
   what it is, who you file with, next due date, source + last-verified, and a
   "mark done for {year}" checkbox.
5. Add **custom deadlines** (for anything we don't cover — e.g. their city).
6. **Export** → download `.ics` (import to Google/Apple Calendar) or PDF summary.

## 4. Profile inputs (drive the list)
| Field | Type | Drives |
|---|---|---|
| state | select (required) | state-entity + deposit-interest + notice items |
| city | select (covered cities) or "not listed" | city-local items |
| entityType | individual \| llc | LLC annual report / franchise |
| llcFormationDate | date (if LLC + anniversary-based state) | anniversary due dates |
| usesContractors | bool | 1099-NEC |
| builtPre1978 | bool | lead disclosure/registration |
| units | number | unit-count-triggered local rules |

(Deposit-interest applicability is derived from `state`.)

## 5. Data model
### Saved profile (Supabase)
`compliance_profiles (user_id uuid pk → auth.users, profile jsonb, updated_at)`,
RLS: owner-only read/write. `profile` JSONB holds the fields above +
`customDeadlines[]` + `completed` (`{obligationId: yearMarkedDone}`).

### Obligation dataset (canonical TS → consumable, like the legal DB)
```ts
type Jurisdiction = "federal" | "state" | "city";
type DueType = "fixed" | "anniversary" | "varies";
type Condition =
  | { type: "always" }
  | { type: "entity"; value: "llc" | "individual" }
  | { type: "usesContractors" }
  | { type: "builtPre1978" }
  | { type: "unitsAtLeast"; n: number }
  | { type: "depositInterestState" };

interface Obligation {
  id: string;
  jurisdiction: Jurisdiction;
  scope: "federal" | string;        // state code or city slug
  title: string;
  what: string;                     // plain-English description
  fileWith: string;                 // agency / who
  dueType: DueType;
  dueDates?: string[];              // MM-DD list, e.g. ["01-31"] or quarterly
  anchorField?: "llcFormationDate"; // for anniversary dueType
  offsetMonths?: number;            // anniversary offset
  conditions: Condition[];          // ALL must match to apply
  cite: { source: string; url?: string; lastVerified: string;
          confidence: "high" | "medium" | "low" };
  sources: string[];                // >=2 for high confidence
}
```

### Engine
`getObligations(profile, today)` → filter by conditions → compute next
occurrence per obligation (fixed: next MM-DD; anniversary: anchor + offset;
varies: show "varies — confirm with {agency}", no auto-date) → merge custom
deadlines → sort by date. Pure + unit-tested.

## 6. Obligation coverage (v1)
- **Federal (high confidence, uniform):** 1099-NEC (Jan 31, if `usesContractors`),
  Schedule E w/ 1040 (Apr 15), quarterly estimated taxes (Apr 15 / Jun 15 /
  Sep 15 / Jan 15), W-9 collection reminder.
- **State entity (LLC):** annual/biennial report + fee per state. **Note:** many
  states are anniversary-of-formation (needs `llcFormationDate`); some are fixed
  dates. Research pass = ~50 data points.
- **Already modeled:** annual security-deposit-interest payment (deposit-interest
  states); lease/rent-increase notice windows (informational).
- **City-local (the 12):** rental registration/renewal, periodic inspection,
  lead registration — for **NYC, LA, Chicago, San Francisco, Seattle,
  Washington DC, Boston, Philadelphia, Minneapolis, Baltimore, Portland,
  San Diego.** Each cited + confidence + last-verified.

### Coverage transparency (non-negotiable)
The UI states: *"We track local deadlines for these 12 cities. Don't see yours?
Add it as a custom reminder."* — so omission is never silent. Anything we can't
date precisely shows `dueType: "varies"` with guidance, never a guessed date.

## 7. iCal export
Generate a `.ics` with one `VEVENT` per obligation occurrence, using `RRULE`
(`FREQ=YEARLY` or quarterly via multiple events / `FREQ=MONTHLY;INTERVAL=3`),
all-day events, with the description = what + fileWith + source. Client-side,
no server. PDF summary reuses the existing `pdfDoc.ts`.

## 8. Accuracy & maintenance
- Same discipline as legal DB: cite, last-verified, confidence; `npm run
  build:legal`-style audit extended to obligations.
- **Maintenance commitment:** tax dates shift (weekends/holidays), LLC fees and
  city rules change. Plan: a quarterly review folded into the monthly cadence in
  `launch-checklist.md`. "We keep your deadlines current" becomes a Pro selling
  point — but it's real recurring work; keep the city list small.
- Disclaimer on page; "confirm with your jurisdiction" on every `varies` item.

## 9. Build sequence
- **Phase 1 (this build, gated behind sign-in):** profile form + engine +
  federal + state-LLC + 12-city dataset + deposit-interest/notice integration +
  in-app list + custom deadlines + iCal/PDF export + Supabase save + the free
  federal guide. Tests for the engine.
- **Phase 1.5:** swap the gate from "signed in" → "Pro" once Stripe billing is live.
- **Phase 2:** email reminders (needs Resend SMTP + a scheduled job / cron).

## 10. Out of scope for v1
- Email/push reminders (Phase 2). Cities beyond the 12 (custom deadlines cover
  the tail). Property-tax due dates (per-county; user-added). Multi-property
  per-unit calendars (one profile in v1; portfolio later).

## 11. Open design points (proposed defaults — flag if you disagree)
1. **Anniversary-based LLC states:** ask for `llcFormationDate` and compute; if
   the user skips it, show the item as `varies`. (Default: yes.)
2. **One profile per user** in v1 (not per-property). Portfolio multi-profile later.
3. **Free guide** is a new guide page (not the existing tax-checklist lead magnet),
   so it can rank for "landlord filing deadlines" queries.
4. **Friend's city:** add it to the 12 if not already there — tell me which.

## 12. What "done" looks like (acceptance)
A signed-in user in, say, Chicago, LLC, uses contractors, pre-1978 building can:
build a profile, see federal + IL LLC + Chicago + deposit-interest obligations
with correct next-due dates, add a custom deadline, mark one done, and export a
`.ics` that imports cleanly into Google Calendar — every system item cited.
