import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { env, isStripeConfigured } from "@/lib/env";
import { getServiceSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Stripe webhook. Verifies the signature against the RAW body, then mirrors
 * subscription status into the Supabase `profiles` table so the rest of the app
 * can read Pro status without ever calling Stripe.
 *
 * Configure the endpoint URL `/api/stripe/webhook` in the Stripe dashboard and
 * subscribe to: checkout.session.completed, customer.subscription.created,
 * customer.subscription.updated, customer.subscription.deleted.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured() || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  const raw = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, env.stripeWebhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "bad signature";
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  // Read the period end from wherever the current API version exposes it.
  const periodEnd = (sub: Stripe.Subscription): string | null => {
    const top = (sub as unknown as { current_period_end?: number })
      .current_period_end;
    const item = sub.items?.data?.[0] as unknown as {
      current_period_end?: number;
    };
    const ts = top ?? item?.current_period_end;
    return ts ? new Date(ts * 1000).toISOString() : null;
  };

  async function syncSubscription(sub: Stripe.Subscription, userId?: string) {
    const uid = userId ?? (sub.metadata?.supabase_user_id as string | undefined);
    if (!uid) return;
    await supabase!.from("profiles").upsert(
      {
        id: uid,
        stripe_customer_id:
          typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        status: sub.status,
        plan: sub.items.data[0]?.price.id ?? null,
        current_period_end: periodEnd(sub),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid =
        (session.metadata?.supabase_user_id as string | undefined) ??
        (session.client_reference_id ?? undefined);
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        await syncSubscription(sub, uid);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await syncSubscription(event.data.object as Stripe.Subscription);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
