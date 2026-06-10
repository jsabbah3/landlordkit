# launch-checklist.md — Your 4–8 hrs/week operating playbook

A concrete, non-spammy plan to get indexed, get traffic, and convert. Designed
for a solo founder with limited hours. Do the **Launch week** once, then run the
**Weekly cadence** indefinitely.

---

## Before you launch (one-time gate)

- [ ] **Review the legal data.** Open `src/tools/*/data.ts`. For every state,
      confirm the rule against the cited statute and bump `confidence` to `high`
      and `lastVerified` to today once verified. Fix any `low` entries first.
- [ ] Deploy + connect domain (see `DEPLOY.md`).
- [ ] Lighthouse 95+ on homepage and one state page.
- [ ] Skim the two published guides for accuracy.

---

## Launch week (one-time, ~4 hours)

1. **Google Search Console** (`DEPLOY.md` step 4): verify domain, submit
   `sitemap.xml`, request indexing for the homepage + your 5 best state pages
   (e.g. California rent increase, Massachusetts deposit interest).
2. **Bing Webmaster Tools**: import from GSC in two clicks. Free extra traffic.
3. Set a **Google Business / brand presence**: nothing fancy — a consistent
   name, logo, and an `about`/contact so the site looks legitimate to E-E-A-T.
4. Create accounts (lurk first, don't post yet) on: **r/Landlord**,
   **r/realestateinvesting**, **BiggerPockets forums**, and find 2–3 active
   **landlord Facebook groups** for your region.
5. Write down 10 target queries you want to own (e.g. "security deposit interest
   massachusetts", "how much notice to raise rent california"). Track their
   position weekly in GSC.

---

## Weekly cadence (4–8 hrs/week)

Pick the same 2–3 sessions each week. Rough split:

### A. Build (2–3 hrs) — one new asset per week
- **Ship one new tool OR one new guide.** Tools first (they create state pages);
  order: late fee → deposit return → lease renewal → rent receipt → prorated
  rent → cash flow. Each new state-aware tool adds ~50 indexable pages.
- When a guide goes live, set `published: true` in `src/content/guides.ts` and
  make sure it links to its related tool (already wired).

### B. Indexing & SEO hygiene (30–45 min)
- In GSC: check **Pages → Indexed** count is rising; fix anything in "Why pages
  aren't indexed".
- Request indexing for the week's new pages.
- Check **Queries**: any query at position 5–15 is a near-win — strengthen that
  page (add an FAQ, a worked example, an internal link).

### C. Distribution (1–2 hrs) — be useful, never spammy
- **Answer, don't advertise.** Each week, find 3–5 real questions on
  r/Landlord, BiggerPockets, or FB groups where your tool is the literal answer
  ("how much interest do I owe my tenant in MA?"). Give a complete, correct
  answer in the comment, and link the specific state page **only when it
  genuinely helps**. Lead with the answer; the link is a citation, not a pitch.
- **Shareable links:** every calculator result has a unique URL (state + inputs
  in the query string). Use these when answering so people can tweak the numbers.
- **One value-add post/week** in a community: e.g. "I pulled together the
  security-deposit-interest rules for all the states that require it" linking the
  tool. Communities reward genuinely useful resources.

### D. PR / citations (occasional, high-leverage)
- **HARO / Qwoted / journalist requests:** answer queries about rental costs,
  landlord regulations, security deposits. Your state-by-state data is citable —
  offer a clean statistic ("X states require landlords to pay interest on
  deposits; rates range from 1% to 5%") with a link. One pickup from a finance
  site is worth months of forum posts for backlinks.
- Pitch a "deposit interest rules by state, updated 2026" angle to personal-
  finance bloggers; offer your data table.

### E. Conversion review (30 min)
- In analytics, look at the funnel: `upgrade_prompt_shown` → `upgrade_clicked` →
  checkouts. If clicks are low, test the nudge copy/placement. If checkouts are
  low, revisit the Pro value props on `/pricing`.
- Read what Pro features people actually ask for in communities; build those.

---

## Non-spammy ground rules (protect the brand)

- Never drop a bare link with no context. Never post the same message in
  multiple places. Never astroturf ("I found this great site!").
- Disclose you built it when relevant ("I built a free calculator for this —
  here's the [state] page"). Honesty plays well in landlord communities.
- Respect each community's self-promotion rules; some have a dedicated thread or
  a ratio (e.g. 9 helpful comments : 1 link).

---

## Monthly review

- Update any state rule that changed (legislatures change caps/notice often).
  Bump `lastVerified`. Note it in a changelog — "state-law update notifications"
  is a Pro feature you can actually deliver.
- Re-run Lighthouse after big changes.
- Check costs are still < $20/mo (`BUSINESS.md`).
- Decide: is it time for display ads yet? (Rule of thumb: 20k+ sessions/mo.)
