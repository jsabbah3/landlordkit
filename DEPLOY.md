# DEPLOY.md — Go live in under 2 hours

Step-by-step. You can follow these without debugging infrastructure. Do them in
order. Times are rough estimates.

> The free tools work with **zero** setup. Steps 1–3 get the site live. Steps
> 4–6 (Stripe/Supabase/email) enable the Pro subscription and can be done later.

---

## 0. Prerequisites (10 min)

- A GitHub account with this repo pushed to it.
- A credit card (for Stripe + domain; everything else is free tier).
- Node 20+ locally if you want to run it first: `npm install && npm run dev`.

---

## 1. Deploy to Vercel (15 min)

1. Go to <https://vercel.com> → **Sign up** with GitHub (free "Hobby" plan).
2. **Add New… → Project** → import this repo.
3. Framework preset auto-detects **Next.js**. Leave build settings default
   (`npm run build`). Click **Deploy**.
4. You'll get a `*.vercel.app` URL. Open it — the site is live.
5. In **Project → Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL` = your `*.vercel.app` URL for now (update in step 2).
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` = leave unset for now (set in step 3).
   Redeploy after adding env vars (**Deployments → … → Redeploy**).

---

## 2. Connect your domain (15 min)

1. Buy a domain (Namecheap/Cloudflare/Porkbun). Suggested: `landlordkit.com`.
2. Vercel **Project → Settings → Domains → Add** your domain. Vercel shows the
   DNS records to set.
3. At your registrar, add the records Vercel gives you (usually an `A` record to
   `76.76.21.21` and/or a `CNAME` for `www`). Propagation: minutes to a few hours.
4. Update `NEXT_PUBLIC_SITE_URL` env var to `https://yourdomain.com` and redeploy.
   This fixes canonical URLs and the sitemap.

---

## 3. Analytics (10 min)

**Plausible (recommended, privacy-friendly, paid after trial):**
1. Sign up at <https://plausible.io>, add your domain.
2. Set env var `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` = `yourdomain.com`, redeploy.
   The script auto-loads (see `src/components/layout/SiteHeader.tsx`) and the
   funnel events in `src/lib/analytics.ts` start flowing.

**Free alternative — GA4:** create a GA4 property, then swap the Plausible
`<Script>` in `SiteHeader.tsx` for the GA4 snippet and repoint `track()` in
`src/lib/analytics.ts` to `gtag`. Everything else stays the same.

---

## 4. Google Search Console (10 min) — do this on day one

1. <https://search.google.com/search-console> → add your domain (use the Domain
   property; verify via the DNS TXT record).
2. **Sitemaps → Add new sitemap** → enter `sitemap.xml`. (Full URL:
   `https://yourdomain.com/sitemap.xml`.)
3. Use **URL Inspection** to request indexing of your homepage and 2–3 top state
   pages. The rest get crawled over the following weeks.

---

## 5. Supabase — accounts (20 min, optional at launch)

The auth + account code is **already built** (`/account`, magic-link sign-in,
`src/lib/supabase/*`, `src/lib/pro.ts`). You just provide a project and run the
schema. Do this before Stripe — billing ties subscriptions to a Supabase user.

1. Create a project at <https://supabase.com> (free tier).
2. **SQL editor → New query**: paste the contents of `supabase/schema.sql` and
   run it. This creates the `profiles` table (with Row Level Security) and a
   trigger that makes a profile row on signup.
3. **Authentication → Providers**: keep **Email** enabled (magic links). Under
   **URL Configuration**, add your site URL and the redirect
   `https://yourdomain.com/auth/callback`.
4. **Project → Settings → API**, copy these into Vercel env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose to the browser)
5. Redeploy. Visit `/account` — you should be able to request a sign-in link.

> With no Supabase keys set, `/account` shows a friendly "coming at launch"
> message and the free tools are unaffected. Safe to ship without this.

---

## 6. Stripe — Pro subscription (20 min, optional at launch)

Checkout, the Customer Portal, and the webhook are **already built**
(`src/app/api/checkout`, `/api/portal`, `/api/stripe/webhook`). You provide keys
and create the products/webhook.

1. Create a Stripe account → stay in **Test mode**.
2. **Products → Add product**: "LandlordKit Pro" with two recurring prices —
   $12.00/month and $99.00/year. Copy each **price ID** (`price_...`).
3. Set env vars in Vercel (note: these are **server-side**, not `NEXT_PUBLIC_`):
   - `STRIPE_SECRET_KEY` (`sk_test_...`)
   - `STRIPE_PRICE_MONTHLY` = the monthly price ID
   - `STRIPE_PRICE_ANNUAL` = the annual price ID
4. **Developers → Webhooks → Add endpoint**:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`,
     `customer.subscription.updated`, `customer.subscription.deleted`.
   - Copy the **Signing secret** → env var `STRIPE_WEBHOOK_SECRET` (`whsec_...`).
5. Redeploy. Sign in at `/account`, click **Go Pro**, and pay with the test card
   `4242 4242 4242 4242` (any future expiry/CVC). After redirect, `/account`
   should show **Pro** and **Manage billing** (the hosted Customer Portal).
6. Only switch to **live-mode** keys after a clean end-to-end test run.

> With no Stripe keys, the "Go Pro" buttons fall back to `/account` and note
> checkout is "coming online at launch" — safe to ship as-is.

---

## 7. Email — Resend (10 min, optional)

1. Create a Resend account, verify your sending domain (DNS records).
2. Set `RESEND_API_KEY`. Use it for transactional email only (magic links,
   receipts). No marketing email from here.

---

## Post-deploy checklist

- [ ] Site loads on your real domain over HTTPS.
- [ ] `https://yourdomain.com/sitemap.xml` lists your pages.
- [ ] `https://yourdomain.com/robots.txt` references the sitemap.
- [ ] Search Console sitemap submitted.
- [ ] Run Lighthouse (Chrome DevTools) on the homepage and one state page —
      target 95+.
- [ ] **Legal data reviewed** — see the warning in each `data.ts`.
- [ ] Then follow [`launch-checklist.md`](./launch-checklist.md).
