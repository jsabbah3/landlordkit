import { getServerSupabase } from "@/lib/supabase/server";

export interface ProStatus {
  signedIn: boolean;
  email: string | null;
  userId: string | null;
  isPro: boolean;
  stripeCustomerId: string | null;
  currentPeriodEnd: string | null;
}

const SIGNED_OUT: ProStatus = {
  signedIn: false,
  email: null,
  userId: null,
  isPro: false,
  stripeCustomerId: null,
  currentPeriodEnd: null,
};

/**
 * Resolves the current user and their Pro subscription status from Supabase.
 * Always safe to call: returns a signed-out status when Supabase isn't
 * configured or no session exists.
 */
export async function getProStatus(): Promise<ProStatus> {
  const supabase = await getServerSupabase();
  if (!supabase) return SIGNED_OUT;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return SIGNED_OUT;

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, status, current_period_end")
    .eq("id", user.id)
    .maybeSingle();

  const active =
    profile?.status === "active" || profile?.status === "trialing";

  return {
    signedIn: true,
    email: user.email ?? null,
    userId: user.id,
    isPro: Boolean(active),
    stripeCustomerId: profile?.stripe_customer_id ?? null,
    currentPeriodEnd: profile?.current_period_end ?? null,
  };
}
