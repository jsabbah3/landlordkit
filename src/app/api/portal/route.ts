import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/env";
import { getProStatus } from "@/lib/pro";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Creates a Stripe Customer Portal session so the user can manage/cancel. */
export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 });
  }
  const status = await getProStatus();
  if (!status.signedIn || !status.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account" }, { status: 400 });
  }
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: status.stripeCustomerId,
    return_url: absoluteUrl("/account"),
  });
  return NextResponse.json({ url: session.url });
}
