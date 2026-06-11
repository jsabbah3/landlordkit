import Stripe from "stripe";
import { env } from "@/lib/env";

/** Lazily-constructed Stripe client. Throws only when actually used without a
 *  key (route handlers guard with isStripeConfigured first). */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!env.stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!_stripe) {
    _stripe = new Stripe(env.stripeSecretKey, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}
