# LandlordKit Launch Playbook

Your operating manual to go from "live" to "$1k/mo." Built for 4–8 hrs/week.
Do **Phase 1** once, then run the **Weekly cadence** indefinitely. Copy-paste
assets (forum posts, PR pitches) are in the **Appendix** at the bottom.

**The one-line strategy:** lead with the two tools whose legal data is verified
(`security deposit interest` + `late fee`), answer real questions where those
tools *are* the answer, publish one guide/week, and let the 200+ state pages
compound in search. Don't pay for traffic; earn it.

---

## Status snapshot (as of this writing)

- ✅ Live on **https://getlandlordkit.com** (HTTPS, auto-deploy on `git push`)
- ✅ **Google Search Console** verified + **sitemap submitted** (229 URLs)
- ✅ Lighthouse 95+ across the board
- ✅ Legal data **verified to `high`** for: Security Deposit Interest (14/15
  states) and Late Fee (all numeric-cap states)
- 🔲 Pro billing (Stripe/Supabase) — deferred until you have traffic to convert
- 🔲 Remaining tools' legal data — verify before you *feature* each one

**Promotion gate:** only promote a tool once its state data is `high` confidence.
Right now that's **deposit interest** and **late fee** — your spearhead.

---

## Phase 1 — First 30 days (one-time)

### Week 1 — Foundations + first helpful presence
- [ ] Bing Webmaster Tools: import from GSC (2 clicks) — free extra traffic.
- [ ] In GSC → URL Inspection, request indexing for your 5 best pages:
  `/tools/security-deposit-interest-calculator`, `/tools/late-fee-calculator`,
  and 3 high-demand state pages (e.g. CA late fee, MA deposit interest, NY late fee).
- [ ] Make accounts on **r/Landlord**, **r/RealEstateInvesting**,
  **BiggerPockets**. **Lurk and comment helpfully — do NOT post links yet.**
  Build a tiny bit of karma/history so you're not a drive-by account.
- [ ] Join 2–3 **landlord Facebook groups** (search "landlord" + your state).
- [ ] Pick your **10 target queries** (Appendix C) and note their current GSC
  position so you can track movement.

### Week 2 — Start answering
- [ ] Each day, find **2–3 real questions** where a tool is the literal answer
  ("how much late fee can I charge in TN?"). Answer fully in the comment; link
  the specific state page as a citation (Appendix A1). ~20 min/day.
- [ ] Sign up for **HARO/Qwoted/Featured** (journalist requests). Set alerts for
  "rent," "landlord," "security deposit," "tenant."

### Week 3 — First value posts + PR
- [ ] Post **one genuine value post** to r/Landlord (Appendix A2) and one to a
  BiggerPockets forum. These are resources, not pitches.
- [ ] Send your **first 2–3 HARO pitches** (Appendix B) using your verified
  stats. One pickup on a finance site = a backlink worth months of forum posts.

### Week 4 — Review + double down
- [ ] GSC: which pages got impressions/clicks? Which queries sit at position
  5–15 (near-wins)? Strengthen those pages (add FAQ/example/internal link).
- [ ] Repeat what worked; drop what didn't. Update `BUSINESS.md` metrics.

---

## Weekly cadence (4–8 hrs/week, indefinitely)

| Block | Time | What |
|---|---|---|
| **A. Build** | 2–3 hr | Ship 1 new asset. Verify the next tool's legal data → promote it; or publish 1 guide (`published: true` in `src/content/guides.ts`). New state-aware tools add ~50 indexed pages each. |
| **B. SEO hygiene** | 30–45 min | GSC: indexed count rising? Fix "why not indexed." Request indexing for new pages. Find position 5–15 queries and improve those pages. |
| **C. Distribution** | 1–2 hr | Answer 3–5 real questions (link as citation, never a bare drop). One value post/week. Use the shareable result URLs so people can tweak numbers. |
| **D. PR/citations** | occasional | Answer HARO requests with your state-data statistics. Pitch "X by state, 2026" data angles to finance bloggers. |
| **E. Conversion** | 30 min | (Once Pro is live) watch `upgrade_prompt_shown → upgrade_clicked → checkout`. Tune nudge copy. Note which Pro features people ask for. |

---

## Content engine — next guides & target keywords

Publish in this order (each maps to a tool and a real search pattern):
1. "Late rent fees by state" — already drafted; promote with the late-fee tool.
2. "How much notice to raise rent" — drafted; promote with the notice tool.
3. "Security deposit laws by state" — drafted; the deposit-interest hub.
4. Then: prorating rent, returning a deposit, rent receipts, cash flow.

Keyword shape that wins for you: **`[topic] + [state]`** long-tail (low
competition, high intent) — exactly what your programmatic pages target.

---

## Metrics dashboard (check weekly — pair with BUSINESS.md)

| Metric | Where | Healthy trend |
|---|---|---|
| Indexed pages | GSC → Pages | Rising toward 229 |
| Impressions / clicks | GSC → Performance | Up week over week |
| Top queries & positions | GSC → Performance | Queries climbing into top 10 |
| Tool usage events | Analytics (`tool_used`) | Rising; shows which tools land |
| Free→Pro funnel | Analytics (`upgrade_*`) | (after Pro launch) |
| Operating cost | Vercel/Supabase/Stripe | < $20/mo |

**Revenue math reminder:** ~80 Pro subs @ $12 = ~$1k/mo. At a 1–3% free→paid
rate, that needs ~3k–8k engaged visitors/mo. Indexing 200+ pages is how you get
there — be patient; SEO compounds over months.

---

## Guardrails (protect the brand — this audience is wary)

- **Never** drop a bare link with no context, post the same text in multiple
  places, or pretend to be a happy stranger. That gets you banned and torches trust.
- **Always** lead with a complete, correct answer; the link is a citation.
- **Disclose** you built it ("I made a free calculator for this — here's the
  [state] page"). Honesty plays well with landlords.
- Respect each community's self-promo rules (some want a 9:1 helpful-to-link ratio).
- Keep the legal data accurate — one wrong cap caught publicly costs more trust
  than ten good answers earn.

---

## Monthly review

- Update any state rule that changed; bump `lastVerified`. Log it — "state-law
  update notifications" is a real Pro feature you can ship.
- Re-run `npm run legal-audit`; keep chipping `low` → `high`.
- Re-run Lighthouse after big changes; confirm cost < $20/mo.
- Display ads decision: wait until ~20k sessions/mo, then test.

---

# Appendix — copy-paste assets

> Adapt the bracketed parts. Keep the honest, helpful tone. The stats below come
> from your **verified** data — safe to cite.

## A1. Reddit/forum *answer* template (when someone asks a question)

> In [State], the late fee is capped at **[X% / the lesser of $Y or Z%]**, and you
> can't charge it until rent is **[N] days** late ([statute cite]). So on $[rent]
> rent that's a max of $[amount]. Worth noting a fee above the cap is generally
> void even if it's in the lease.
>
> I built a free calculator that does this per state with the statute cited if
> it helps: [link to the specific state page]. Not legal advice, just the rule.

## A2. Reddit *value post* (r/Landlord) — a resource, not a pitch

> **Title:** Which states actually require you to pay interest on a tenant's
> security deposit? (I went through all 50)
>
> I kept seeing this question, so I checked every state. Short version: only
> about **15 states (including DC)** — plus a few cities like Chicago — require
> landlords to pay interest on the deposit. The rules vary a lot — Massachusetts is a flat
> 5% if you hold it a year, Ohio is 5% on the amount over one month's rent after
> 6 months, others tie it to a bank or Treasury rate that changes yearly.
>
> I put it into a free calculator with the statute cited for each state and a PDF
> statement you can hand the tenant (no signup): [link]. Happy to answer
> questions in the comments. Not legal advice — always check your local rules.

## A3. BiggerPockets forum post (investor-leaning)

> **Title:** Free state-by-state late-fee + deposit-interest calculators (with
> the statutes cited)
>
> Sharing a couple of free tools I built for my own properties. The late-fee one
> shows your state's legal cap and grace period (e.g. Maine 4%, NY the lesser of
> $50 or 5%, lots of states have no fixed cap), and the deposit-interest one
> calculates what you owe a tenant where it's required. Each cites the statute
> and the date I last checked it. Links: [late fee] / [deposit interest].
> Feedback welcome — I'm adding tools weekly.

## A4. Facebook group post (casual)

> Made a free calculator for the "how much late fee can I legally charge?"
> question that comes up here a lot — pick your state and it shows the cap +
> grace period with the law cited. No signup: [link]. Hope it helps someone.

## B. HARO / journalist pitch template

> **Subject:** Data: security-deposit interest rules across all 50 states
>
> Hi [name] — for your piece on [topic], here's a clean, citable stat: only
> **about 15 states (including DC) require landlords to pay interest on security
> deposits**, and the rates range from ~1% (Minnesota) to 5% (Massachusetts/Ohio), with
> several states tying it to a bank or Treasury rate. Late-fee caps similarly
> range from **4% (Maine) to 10%+ (Texas, Tennessee)**, while many states set no
> cap at all.
>
> I maintain a free, statute-cited database of these rules at getlandlordkit.com
> and am happy to provide a state-by-state breakdown or a quote. I'm [name],
> founder of LandlordKit. Reachable at [email].

## C. 10 starter target queries (track position in GSC)

1. security deposit interest massachusetts
2. security deposit interest calculator
3. late fee calculator rent [your state]
4. maximum late fee [state]
5. how much late fee can a landlord charge in texas
6. ohio security deposit interest
7. does [state] require security deposit interest
8. rent late fee grace period [state]
9. how much notice to raise rent california
10. security deposit interest by state
