/**
 * Saved landlord/property "master record" — the Pro data spine. Stored in the
 * browser (localStorage) so it works with no account today; cloud-sync for
 * signed-in users layers on later (same pattern as the Compliance Calendar).
 *
 * Tools read this to prefill their fields ("no re-typing"); a "Save my details"
 * action writes the current inputs back. One record in v1; multi-property later.
 */
export interface SavedProfile {
  landlordName?: string;
  tenantName?: string;
  propertyAddress?: string;
  state?: string; // USPS code
  monthlyRent?: string;
  leaseStartDate?: string; // ISO
  leaseEndDate?: string; // ISO
  securityDeposit?: string;
  depositDate?: string; // ISO (move-in)
}

const KEY = "lk_profile_v1";

/** Merge `patch` into `base`, ignoring empty/blank values so "Save" never wipes
 *  a stored field with a blank one. Pure — the testable core. */
export function mergeProfile(base: SavedProfile, patch: SavedProfile): SavedProfile {
  const out: SavedProfile = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v != null && String(v).trim() !== "") {
      out[k as keyof SavedProfile] = String(v);
    }
  }
  return out;
}

export function hasProfile(p: SavedProfile): boolean {
  return Object.values(p).some((v) => v != null && String(v).trim() !== "");
}

export function loadProfile(): SavedProfile {
  try {
    if (typeof localStorage === "undefined") return {};
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedProfile) : {};
  } catch {
    return {};
  }
}

export function saveProfile(patch: SavedProfile): SavedProfile {
  const next = mergeProfile(loadProfile(), patch);
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked — ignore */
  }
  return next;
}

export function clearProfile(): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
