# LAUNCH-DAY-RUNBOOK.md

One page to run launch day (Product Hunt / big Reddit / press hit) without help.
Launch copy + hour-by-hour: `gtm/product-hunt.md`. This is the *ops* side.

## Pre-flight (the morning before) — 20 min
- [ ] **Run schema.sql if you haven't.** Until you do, email capture is broken
      (500s) and you'll waste launch traffic. Supabase → SQL → paste
      `supabase/schema.sql` → Run. Then test: submit your email on the
      homepage — the checklist should download AND a row should appear in the
      `subscribers` table.
- [ ] `node scripts/growth/check-site.mjs` → must print ALL CHECKS PASS.
- [ ] Confirm GA4 Realtime shows you when you load the site (analytics is the
      only way you'll know launch worked).
- [ ] Load these entry pages once, eyeball for anything broken: `/`,
      `/laws/california`, `/laws/new-york`, `/tools/late-fee-calculator`,
      `/tools/security-deposit-interest-calculator`,
      `/reports/security-deposit-interest-2026`, `/pricing`, `/about`.
- [ ] Paste your launch links into an OG previewer (e.g. opengraph.xyz) — the
      report and hub pages now have their own cards; confirm they render.

## What can break, and the fix (in likelihood order)

| If this happens | Symptom | Fix / mitigate |
|---|---|---|
| **Email capture fails** | signups don't land in `subscribers` | 99% cause: schema.sql not run. Run it. The PDF still downloads regardless, so you don't lose the user — but you lose the email. |
| **Supabase free-tier limit hit** (traffic spike) | /account, sign-in, Pro, email capture error | **Free tools are isolated — they keep working** (all calculators/PDFs run in the browser, no server call). Confirmed: only auth/accounts/capture depend on Supabase. Don't panic; the core site is up. If it persists, upgrade Supabase (paid) or wait out the window. |
| **Stripe checkout issue** | "Go Pro" errors | Check Vercel env vars are present on the prod deployment; check Stripe dashboard for API errors. Free tools + capture are unaffected — Pro is a small fraction of launch value. |
| **A page 404s that you shared** | dead link on PH/Reddit | Low-confidence tool state pages are noindexed but still load; if you shared a `/laws/<state>` that isn't a hub yet it 404s — share only the states listed on `/laws`, or a tool page instead. |
| **GA4 shows nothing** | can't see traffic | You're probably viewing a different property or an ad blocker eats your own hits — check on your phone on cellular. Traffic is still landing. |
| **Someone reports a wrong legal value** | credibility hit in comments | This is the one that matters. Reply fast + honestly: "Checking against the statute now, will fix within the hour." Then do exactly that (OPERATIONS §6), commit, reply with the fix. A fast correction *builds* trust; defensiveness destroys it. |
| **vercel.app duplicate shows up** | someone shares landlordkit.vercel.app | Canonicals already point Google to the real domain. Just reply with the getlandlordkit.com link. (Permanent fix is a Jake-action below.) |

## Do NOT do on launch day
- Don't push code changes to `main` during peak traffic unless it's a genuine
  fix — every push redeploys. Batch non-urgent fixes for the evening.
- Don't solicit upvotes ("please upvote") — PH penalizes it. Say "we launched,
  feedback welcome."

## After the peak
- [ ] Log the day's numbers in GROWTH.md (GA4 sessions, signups, any Pro subs).
- [ ] Note every commenter who's a landlord → testimonial/outreach candidates.
- [ ] Add a "featured on Product Hunt" line to `/press` if it went well.

## Standing Jake-actions that make launch smoother (do before, if possible)
1. **Run supabase/schema.sql** (unblocks email capture + lease + reminders).
2. **Redirect landlordkit.vercel.app → getlandlordkit.com** (Vercel → project →
   Settings → Domains → set the vercel.app as a redirect to the primary). Kills
   the duplicate-content copy; canonicals mitigate until then.
3. Confirm RLS is ON for all user tables in Supabase (Auth → Policies).
