"use client";

import { useEffect, useState } from "react";

interface ProStatusClient {
  signedIn: boolean;
  isPro: boolean;
  /** True when the lease-upload backend has an API key configured. */
  leaseExtract: boolean;
  loading: boolean;
}

const LOADING: ProStatusClient = { signedIn: false, isPro: false, leaseExtract: false, loading: true };
const GUEST: ProStatusClient = { signedIn: false, isPro: false, leaseExtract: false, loading: false };

/** Fetches Pro status once on mount. Returns loading:true until the response
 *  arrives so callers can defer gated UI without a flash of wrong content. */
export function useProStatus(): ProStatusClient {
  const [status, setStatus] = useState<ProStatusClient>(LOADING);

  useEffect(() => {
    fetch("/api/pro-status")
      .then((r) => r.json())
      .then((json: { signedIn: boolean; isPro: boolean; leaseExtract?: boolean }) => {
        setStatus({
          signedIn: json.signedIn,
          isPro: json.isPro,
          leaseExtract: Boolean(json.leaseExtract),
          loading: false,
        });
      })
      .catch(() => setStatus(GUEST));
  }, []);

  return status;
}
