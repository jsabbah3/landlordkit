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

## 5. Stripe — Pro subscription (30 min, optional at launch)

The UI hooks are in place (`/pricing` "Go Pro" button, `src/lib/site.ts`
prices). To make checkout live:

1. Create a Stripe account → **Test mode** first.
2. **Products → Add product**: "LandlordKit Pro". Add two prices:
   - $12.00 / month (recurring) → copy its price ID.
   - $99.00 / year (recurring) → copy its price ID.
3. Set env vars: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`,
   `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL`.
4. Add a Checkout route. Create `src/app/api/checkout/route.ts` that creates a
   Stripe Checkout Session (`mode: "subscription"`, the chosen price, success/
   cancel URLs) and redirect the "Go Pro" button to it. Use Stripe's hosted
   **Customer Portal** for cancellations (no custom billing UI needed).
5. Add a webhook at `src/app/api/stripe/webhook/route.ts` for
   `checkout.session.completed` and `customer.subscription.*`; set
   `STRIPE_WEBHOOK_SECRET`. On these events, flip the user's `is_pro` flag in
   Supabase (step 6).
6. Test the full flow with Stripe's test card `4242 4242 4242 4242`. Switch the
   keys to live mode only after a clean test run.

> Until step 5 is done, the "Go Pro" button points to the free tools and the
> page notes checkout is "coming online at launch" — safe to ship as-is.

---

## 6. Supabase — Pro accounts (30 min, optional at launch)

1. Create a project at <https://supabase.com> (free tier).
2. Enable **Auth** (email magic links via Resend, or Google OAuth).
3. Create tables: `profiles` (user_id, email, is_pro, stripe_customer_id),
   `saved_documents`, `properties`. Turn on Row Level Security so users only see
   their own rows.
4. Set env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` (server-only).
5. Gate Pro-only features on the `is_pro` flag. The free tools never touch
   Supabase, so this only affects saved docs / batch / branding / dashboard.

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
