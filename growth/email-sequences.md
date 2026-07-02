# Email sequences — ready to load into any ESP

Status: the site captures emails into the Supabase `subscribers` table (with a
`source` per surface: homepage, guides, `cheatsheet:<state>`, `exit-intent`).
No ESP is connected yet — when Resend (or similar) is set up, paste these in.
Sender: Jake @ LandlordKit. Voice: helpful landlord-to-landlord, zero hype.
Every email: one idea, one link, unsubscribe footer, "not legal advice" where a
rule is stated. Values in [brackets] come from the data files — check the live
page before sending so numbers never drift.

---

## A. Welcome sequence (5 emails)

### W1 — Day 0: deliver + orient
**Subject:** Your checklist (+ the one mistake to check today)
Hi — Jake here, the person behind LandlordKit. Your PDF is attached / linked.
While I have you: the single most common (and most expensive) mistake I see is
a late fee written into a lease that's above the state cap — in most states
that clause is simply unenforceable, and it can weaken an eviction case.
60-second check: [late-fee calculator link, UTM utm_source=email&utm_medium=welcome&utm_campaign=w1]
That's it. Over the next two weeks I'll send four short emails with the
highest-value checks — then you'll only hear from me when a law changes.

### W2 — Day 3: the deposit deadline
**Subject:** The 14–60 day clock most landlords don't calendar
Every state gives you a deadline to return a deposit after move-out — 14 to 60
days — and missing it can cost 2–3x the deposit plus attorney fees in many
states. The fix is boring: calendar the deadline the day a tenant gives
notice. Your state's deadline + an itemized-statement generator:
[deposit-return tracker link, w2]

### W3 — Day 6: deposit interest (the sleeper)
**Subject:** 15 states make you pay interest on deposits. Yours?
Only about 15 states (plus cities like Chicago) require it, and the rules are
weird — Massachusetts is a flat 5%; Ohio only on the excess over one month's
rent after 6 months; several states publish a new rate every year, so you can
drift out of compliance without touching anything.
Check yours (statute cited): [deposit-interest calculator link, w3]

### W4 — Day 10: the filing calendar
**Subject:** 1099s, estimated taxes, LLC reports — your dates, one page
The deadlines that actually bite landlords: 1099-NEC by Jan 31 for any
contractor you paid $600+, quarterly estimated taxes, Schedule E, your state's
LLC/annual report, local rental registration. Two minutes to build your
personal list (state + city + entity type), then export it to your calendar:
[compliance calendar link, w4]

### W5 — Day 14: the honest pitch (only Pro email in the sequence)
**Subject:** How LandlordKit stays free
All the tools are free forever — the site is paid for by LandlordKit Pro
($12/mo or $99/yr): saved property details so you never retype, batch receipts
for every unit in one PDF, watermark-free documents with your branding, lease
autofill, and deadline reminders pushed to your calendar. If the free tools
have saved you time, Pro will save you more: [pricing link, w5]
Either way — you'll now only hear from me when a state law changes or a new
tool ships. Reply anytime; I read everything.

---

## B. Monthly "State Law Update" newsletter — 6 templates

Format for each: 1 headline change or spotlight → 2–3 quick hits → 1 tool.
Fill [values] from the live data pages the day you send.

### M1 — The rate-reset issue (send January)
Headline: New year, new published rates. CT / MD / DC / IL / ND publish
deposit-interest rates annually — the [year] figures are now on each state
page. If you hold deposits in those states, your owed rate changed on
[effective dates]. Quick hits: 1099-NEC due Jan 31; Q4 estimated taxes Jan 15.
Tool: deposit-interest calculator.

### M2 — The late-fee audit issue
Headline: Audit your lease's late-fee clause against the cap ([N] states have
hard caps; see the table). Quick hits: [any legislative session activity —
check GROWTH weekly notes]; grace periods vary 3–30 days. Tool: late-fee
calculator + the Regulation Index report.

### M3 — The move-out season issue (send ~May)
Headline: Move-out season = deposit-return deadlines. The clock, itemization
rules, and the 2–3x penalty. Quick hits: photos at move-in/out; forwarding
address rule. Tool: deposit-return tracker.

### M4 — The mid-year law-change issue (send ~July)
Headline: Laws that took effect July 1 in [states — check session trackers;
e.g. FL's HB 1417 took effect July 1, 2023]. Quick hits: rent-increase notice
refresher; new verified states on /laws. Tool: state law hub for [state].

### M5 — The lease-renewal issue (send ~September)
Headline: Renewal season — notice periods for increases, tiered rules (CA
90-day >10%; NY 30/60/90 by tenancy length). Quick hits: month-to-month
termination notice table; renewal letter generator. Tool: rent-increase notice
generator.

### M6 — The year-end issue (send ~December)
Headline: Year-end tax prep — the checklist, contractor W-9 collection before
January, depreciation notes. Quick hits: Q4 estimated tax date; compliance
calendar for [year+1]. Tool: compliance calendar + tax checklist.

---

## C. Instrumentation

- Every link: `?utm_source=email&utm_medium=<welcome|newsletter>&utm_campaign=<w1..w5|m1..m6>`.
- Watch GA4: `email_signup` by `source` tells you which magnet converts
  (homepage checklist vs state cheat sheets vs exit-intent) — see gtm/metrics.md.
- Capture-rate target: ≥2% of unique visitors on magnet-bearing pages.
