"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";

/**
 * Passwordless email sign-in. Posts to our own /api/auth/otp (same origin) so
 * the request can't be blocked by ad blockers or network filters that block
 * *.supabase.co — the server sends the magic link. The link returns to
 * /auth/callback.
 */
export function SignInForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("sent");
      } else {
        setErrMsg(data.error || "Something went wrong. Please try again.");
        setState("error");
      }
    } catch (err) {
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
