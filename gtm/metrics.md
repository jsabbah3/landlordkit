# GTM metrics — the weekly dashboard

The point: spend your 4–8 hrs/week on what's working, not what feels productive.
Check this once a week (same day each week), fill the table, act on the read.

## Step 0 — turn measurement on (one-time)

The app already fires every event below; nothing reaches a provider until a key
is set. In Vercel → Environment Variables (Production), set **one** of:

- `NEXT_PUBLIC_GA_ID` — GA4 measurement ID (`G-XXXXXXXX`). Free, custom events. Recommended.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — if you'd rather pay for cookieless Plausible later.

Redeploy. Confirm in GA4 → Realtime that pageviews and a `tool_used` event show up.

## The funnel (and the event that measures each step)

| Stage | What it means | GA4 event(s) |
|---|---|---|
| **Acquisition** | Someone landed | pageview (automatic) |
| **Activation** | Used a tool / got value | `tool_used`, `pdf_downloaded`, `result_shared` |
| **Lead** | Joined the email list | `email_signup` |
| **Pro intent** | Saw / clicked an upgrade prompt | `upgrade_prompt_shown` → `upgrade_clicked` |
| **Checkout** | Started Stripe checkout | `checkout_started` |
| **Revenue** | Subscribed | `pro_subscribed` (proxy) + Stripe dashboard (truth) |

Pro-value engagement signals (leading indicators of retention/upsell):
`profile_saved`, `reminders_enabled`, `lease_extracted`, `lease_saved_to_profile`.

> **Source of truth for money is Stripe**, not GA. `pro_subscribed` fires on the
> checkout-success page for funnel attribution; reconcile the count against
> Stripe → Subscriptions weekly (they should be close).

## Weekly numbers to record

| Week | Visitors | Tool uses | PDF/ICS downloads | Email signups | `checkout_started` | New Pro subs (Stripe) | MRR |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

Derived ratios worth watching:
- **Visitor → activation** = tool uses ÷ visitors (is the traffic the right people?)
- **Activation → lead** = email signups ÷ tool uses (is the lead magnet pulling?)
- **Checkout → subscribe** = new subs ÷ `checkout_started` (is checkout converting, or leaking?)
- **MRR vs the goal:** $1,000/mo ≈ **80 subs** at $12. Track the line, not the day.

## How to read it (decision rules)

- **Traffic up, activation flat** → wrong audience or weak landing pages. Check which pages/queries bring traffic (GA4 → Pages, Search Console) and double down on the ones that *also* drive `tool_used`.
- **Activation up, email signups flat** → the lead magnet isn't compelling or is buried. Test placement/copy.
- **`upgrade_clicked` healthy, `checkout_started` low** → the pricing page or sign-in step is leaking. Walk the flow yourself.
- **`checkout_started` healthy, `pro_subscribed` low** → payment friction or pricing objection. Check Stripe for failed/abandoned payments.
- **Best acquisition page** → the page with the highest *activation*, not the highest traffic. Make more like it (more states, more tools in that vein) and point backlinks at it.

## Channels — attribute new traffic

**UTM-tag referral links** (Reddit comments, newsletter sends, social, paid) so
GA4 shows which channel drove *activation*, not just clicks:

```
?utm_source=reddit&utm_medium=community&utm_campaign=deposit-interest
?utm_source=newsletter&utm_medium=email&utm_campaign=<name>
```

**Do NOT UTM-tag permanent backlinks** (directory listings, blogger/newsletter
*article* links you're earning for SEO) — use the clean canonical URL so the
link passes equity; GA4's Referrals report attributes that traffic by domain.

The `gtm-skills:utm-builder` skill can generate tags consistently. Rule of
thumb: if a channel drives clicks but no `tool_used`, it's the wrong audience —
stop spending time there.
