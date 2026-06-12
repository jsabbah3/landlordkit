import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Same-origin magic-link sender. The browser POSTs here (first-party, so ad
 * blockers / network filters that block *.supabase.co never see it); the server
 * — which can always reach Supabase — sends the OTP email. The PKCE verifier is
 * stored in cookies by the server client and read back in /auth/callback.
 */
export async function POST(request: Request) {
  const supabase = await getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Sign-in isn't configured yet." },
      { status: 503 },
    );
  }

  let email = "";
  try {
    email = String((await request.json())?.email ?? "").trim();
  } catch {
    /* fall through to validation */
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: absoluteUrl("/auth/callback") },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
