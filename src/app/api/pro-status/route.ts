import { NextResponse } from "next/server";
import { getProStatus } from "@/lib/pro";

export const dynamic = "force-dynamic";

/** Lightweight Pro status endpoint for client components. Returns only what
 *  they need — no Stripe IDs or period dates exposed to the browser. */
export async function GET() {
  const { signedIn, isPro } = await getProStatus();
  return NextResponse.json({ signedIn, isPro });
}
