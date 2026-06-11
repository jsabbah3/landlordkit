"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/** Opens the Stripe Customer Portal for an existing subscriber. */
export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  async function open() {
    setLoading(true);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button variant="secondary" onClick={open} disabled={loading}>
      {loading ? "Opening…" : "Manage billing"}
    </Button>
  );
}
