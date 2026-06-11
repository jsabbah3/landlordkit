"use client";

import { useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";

/** Passwordless email sign-in (magic link). The link returns to /auth/callback. */
export function SignInForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setErrMsg("Sign-in isn't configured (missing Supabase env vars).");
      setState("error");
      return;
    }
    setState("sending");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setErrMsg(error.message);
        setState("error");
      } else {
        setState("sent");
      }
    } catch (err) {
      // Network/URL errors (e.g. a bad NEXT_PUBLIC_SUPABASE_URL) land here.
      setErrMsg(err instanceof Error ? err.message : "Unexpected error");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="text-sm text-brand-700">
        Check your inbox — we emailed a sign-in link to <strong>{email}</strong>.
      </p>
    );
  }

  return (
    <form onSubmit={send} className="space-y-3">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <Button type="submit" className="w-full" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Email me a sign-in link"}
      </Button>
      {state === "error" && (
        <p className="text-sm text-red-600">
          {errMsg || "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}
