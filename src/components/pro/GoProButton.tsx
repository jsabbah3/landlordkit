"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

/** Starts Stripe Checkout. If the user isn't signed in, sends them to /account. */
export function GoProButton({
  plan = "monthly",
  children,
  className,
}: {
  plan?: "monthly" | "annual";
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    track("checkout_started", { plan });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) {
        router.push("/account?next=pro");
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push("/account");
      }
    } catch {
      router.push("/account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="accent" className={className} onClick={go} disabled={loading}>
      {loading ? "Starting…" : children}
    </Button>
  );
}
