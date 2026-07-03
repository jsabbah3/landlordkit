# RISK-REGISTER.md — residual risk after the red-team audit (2026-07-02)

Ranked by expected damage. "Residual" = what remains after the fixes in
AUDIT.md. Monitoring for each is merged into OPERATIONS.md §9.

## 1. Wrong legal value published (brand-ending, ongoing) — HIGH
**Plain English:** the whole business is "we're the accurate one." A single
wrong number that a landlord relies on, or that a journalist catches, does
disproportionate damage. The audit found two live errors (WA, CO) that had been
public for weeks — proof the risk is real, not theoretical.
**Residual after fixes:** high-traffic states re-verified; unverified states
noindexed and badged. But ~25 low-confidence states still display values (with
warnings), and even "verified" values go stale as laws change.
**Monitor:** OPERATIONS §9 — instant response to any reported error; monthly
staleness script; annual January rate re-check; watch fast-moving states.
**If it happens:** fast public correction *builds* trust — own it, fix within
the hour, reply with the commit. Never get defensive.

## 2. schema.sql not run → silent lead loss at launch — HIGH (but one-click fix)
**Plain English:** email capture 500s in production right now. During a launch
spike you'd collect zero emails while thinking it works (the PDF still
downloads, so nothing looks broken). Also blocks lease autofill + reminders.
**Residual:** entirely pending on the Jake-action.
**Monitor:** monthly test-signup (OPERATIONS §9). **Fix:** run supabase/schema.sql
before any launch (LAUNCH-DAY-RUNBOOK pre-flight).

## 3. RLS unconfirmed in production — MEDIUM
**Plain English:** the schema *defines* correct owner-only access, but because
schema.sql wasn't fully run, we can't confirm from here that row-level security
is actually ON for the newer tables in prod. If a table exists with RLS off,
one user could read another's saved data.
**Residual:** unverifiable without DB access.
**Monitor/fix:** after running schema.sql, confirm RLS ON for profiles,
landlord_profiles, compliance_profiles, subscribers, lease_extractions
(Supabase → Auth → Policies). One-time, 2 minutes.

## 4. Client-side Pro entitlements bypassable — LOW (accepted)
**Plain English:** a technical user can edit browser state to strip the PDF
watermark or batch-generate without paying. Inherent to generating PDFs in the
browser (which is what makes the tools free to run).
**Residual:** accepted. Real paid value (cloud save, lease AI, reminders) is
server-enforced, so the loss is cosmetic. Revisit only if it's ever abused at
scale — the fix (server-side PDF generation) would add cost and complexity.

## 5. Duplicate content on vercel.app — LOW
**Plain English:** the old preview domain serves the whole site and is
crawlable. Canonicals already tell Google the real home, so impact is small,
but it's untidy and could split signals.
**Monitor:** GSC / check-site for vercel.app URLs. **Fix:** redirect the domain
(OPERATIONS §8.2).

## 6. No unsubscribe mechanism yet — LOW now, MEDIUM at email launch
**Plain English:** capture copy promises "unsubscribe anytime," but no email is
sent yet so there's nothing to unsubscribe from. The moment an ESP goes live and
a real send happens, a working unsubscribe + List-Unsubscribe header is legally
required (CAN-SPAM).
**Monitor/fix:** gated on the Resend setup — OPERATIONS §8.3 makes it a
precondition of sending.

## 7. Unthrottled /api/subscribe — LOW (accepted)
**Plain English:** someone could script junk signups. Email upsert dedupes, so
worst case is junk rows, not a breach or cost blowout.
**Monitor:** watch subscriber growth for implausible spikes. **Fix if abused:**
Vercel WAF rule or an Upstash rate-limit (small effort).

## 8. Dependency advisories — LOW (accepted)
Two moderate transitive `postcss`-inside-Next build-time advisories; not
runtime-exploitable for a static site. Clears on the next Next.js minor.
**Monitor:** `npm audit` in the monthly loop; upgrade Next when convenient.

## 9. Launch performance unverified from here — LOW
Couldn't run headless Lighthouse; pages are static/SSG and were 95+ mobile last
sprint. **Fix:** PageSpeed Insights on the 8 entry pages pre-launch
(LAUNCH-DAY-RUNBOOK).
