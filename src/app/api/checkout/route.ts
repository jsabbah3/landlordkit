import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { env, isStripeConfigured } from "@/lib/env";
import { getServerSupabase } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Creates a Stripe Checkout session for a Pro subscription and returns its URL.
 * Requires a signed-in Supabase user so the resulting subscription can be tied
 * back to their account by the webhook.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 });
  }

  const supabase = await getServerSupabase();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }

  let plan = "monthly";
  try {
    const body = await request.json();
    if (body?.plan === "annual") plan = "annual";
  } catch {
    /* default to monthly */
  }
  const price =
    plan === "annual" ? env.stripePriceAnnual : env.stripePriceMonthly;
  if (!price) {
    return NextResponse.json({ error: "Price not configured" }, { status: 503 });
  }

  // Reuse an existing Stripe customer if we've stored one.
  const { data: profile } = await supabase!
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email ?? undefined,
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
    subscription_data: { metadata: { supabase_user_id: user.id } },
    allow_promotion_codes: true,
    success_url: absoluteUrl("/account?checkout=success"),
    cancel_url: absoluteUrl("/pricing?checkout=cancelled"),
  });

  return NextResponse.json({ url: session.url });
}
