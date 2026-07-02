# Conversion experiments — 12 fully-specified, ranked

Run ONE at a time, 2 weeks minimum (traffic is low; don't split-test, do
before/after with GA4 event comparison). For each: implement exactly as
specced, record the before-baseline in GROWTH.md first, then the decision rule
says keep or revert. Any model (or Jake) can execute these paint-by-numbers.

**Prereq for all:** GA4 running ≥2 weeks for the baseline.

## 1. Cheat-sheet magnet on tool state pages (highest expected lift)
- **Hypothesis:** the per-state cheat sheet converts better than the generic tax checklist on state-specific pages.
- **Implement:** add `<StateCheatSheetCapture code state>` to the 4 tool `[state]` page templates (below the tool, above FAQs). Component exists.
- **Metric:** `email_signup` where source starts `cheatsheet:` ÷ state-page sessions.
- **Decision:** ≥2× the current state-page signup rate → keep + consider on guides; < current → revert.

## 2. Upgrade nudge copy: outcome vs feature
- **Hypothesis:** "Never retype this again" (outcome) beats current feature-list reason strings.
- **Implement:** edit `reason` props passed to UpgradeNudge in RentReceiptTool + RentIncreaseNoticeTool to outcome phrasing.
- **Metric:** `upgrade_clicked` ÷ `upgrade_prompt_shown` per feature tag.
- **Decision:** CTR +25% relative → roll to all tools; else revert.

## 3. Pricing page: annual-first
- **Hypothesis:** showing "$99/yr (2 months free)" as the primary CTA raises annual mix without hurting total conversions.
- **Implement:** in pricing page Pro card, swap GoProButton to `plan="annual"` primary with monthly as secondary text link; copy: "…or $12/mo".
- **Metric:** `checkout_started` split by plan + total `pro_subscribed`.
- **Decision:** total conversions flat/up AND annual share up → keep.

## 4. Exit-intent magnet match
- **Hypothesis:** exit-intent converts better offering the page-relevant magnet (state cheat sheet on /laws, checklist elsewhere) than checklist-always.
- **Implement:** in ExitIntentCapture, detect `/laws/<state>` from pathname → render StateCheatSheetCapture instead.
- **Metric:** signup ÷ `exit_intent_shown` by path group.
- **Decision:** +30% on /laws paths → keep.

## 5. Tool page → hub cross-link block
- **Hypothesis:** a "See all verified [State] rules" box on tool state pages lifts pages/session and hub discovery.
- **Implement:** small Callout on the 4 tool `[state]` templates linking `/laws/<state>` (only when the hub exists — use `hubStates()`).
- **Metric:** GA4 navigation to /laws/* from /tools/*; bounce rate on state pages.
- **Decision:** hub sessions +50% with flat bounce → keep (it's also an internal-linking SEO win — likely keep regardless unless bounce spikes).

## 6. Receipt tool: "email me this receipt" capture
- **Hypothesis:** offering to email the generated receipt captures high-intent users at the value moment.
- **Implement:** after `pdf_downloaded` in RentReceiptTool, show inline EmailCapture with source `post-receipt`.
- **Metric:** signups/source, and no drop in `pdf_downloaded`.
- **Decision:** ≥1% of downloads convert → keep.

## 7. Homepage hero: task-first search box
- **Hypothesis:** a "What do you need? [state + task picker]" above the fold beats the static hero for activation.
- **Implement:** client component: two selects (state, task) → routes to the right tool state page; keep hero copy below.
- **Metric:** `tool_used` ÷ homepage sessions.
- **Decision:** +20% activation → keep.

## 8. Pro annual banner for active monthly subs
- **Hypothesis:** monthly subscribers switch to annual when shown the $45/yr savings at login.
- **Implement:** account page: if plan == monthly price id, banner "Switch to annual — save $45/yr" → portal link.
- **Metric:** plan changes in Stripe over 30 days.
- **Decision:** ≥10% of monthly cohort switches → keep permanently.

## 9. Guides → tool CTA placement
- **Hypothesis:** an inline tool CTA after the FIRST section beats the current end-of-guide placement.
- **Implement:** in guide renderer, after sections[0], render the first relatedTool card inline.
- **Metric:** guide → tool click-through (GA4 path), `tool_used` sessions originating on guides.
- **Decision:** +25% CTR → keep.

## 10. Watermark copy test
- **Hypothesis:** footer "Made with LandlordKit — free landlord tools" converts recipients better as "Verified against [State] statute — getlandlordkit.com".
- **Implement:** change footer string in pdfDoc.ts (non-Pro only).
- **Metric:** direct + referral traffic to /; hard to attribute — treat as brand test, run 4 weeks.
- **Decision:** inconclusive metrics → keep whichever reads better; low risk.

## 11. /laws index: "your state" geolocation nudge
- **Hypothesis:** surfacing the visitor's state first (client-side, via Intl timezone heuristic — no IP service, $0) lifts hub CTR.
- **Implement:** client component on /laws sorting the visitor's likely state card first with a "Your state?" badge.
- **Metric:** /laws → /laws/<state> CTR.
- **Decision:** +20% → keep.

## 12. Compliance calendar signup gate test (CAREFUL)
- **Hypothesis:** asking for email to *save* the calendar (not to use it) converts without hurting usage.
- **Implement:** after first calendar build for anonymous users, soft prompt: "Email yourself this calendar" (EmailCapture, source `calendar-save`).
- **Metric:** signups/source AND `tool_used` for the calendar (must not drop).
- **Decision:** signups ≥2%/session with usage flat → keep. Usage drops → revert immediately (free-forever promise is the moat).
