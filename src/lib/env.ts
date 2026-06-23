/**
 * Centralized env access for the Pro (paid) surface. Everything that touches
 * Stripe or Supabase reads through here and checks the *_CONFIGURED flags first,
 * so the app builds and the free tools work even when no keys are set (e.g. on a
 * fresh clone or a preview deploy before you've added secrets).
 */
export const env = {
  // Supabase (auth + Pro account storage)
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Stripe (billing)
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripePriceMonthly: process.env.STRIPE_PRICE_MONTHLY,
  stripePriceAnnual: process.env.STRIPE_PRICE_ANNUAL,

  // Anthropic (lease-upload autofill — Pro feature). Pay-per-use; the feature
  // stays hidden until this key is set, exactly like Stripe/Supabase above.
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
} as const;

export const isSupabaseConfigured = (): boolean =>
  Boolean(env.supabaseUrl && env.supabaseAnonKey);

export const isStripeConfigured = (): boolean =>
  Boolean(env.stripeSecretKey && env.stripePriceMonthly);

export const isLeaseExtractConfigured = (): boolean =>
  Boolean(env.anthropicApiKey);

/** Public flag safe to read in client components (NEXT_PUBLIC_* only). */
export const proEnabledClient = (): boolean =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
