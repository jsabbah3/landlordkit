"use client";

import { useState } from "react";
import { saveProfile, type SavedProfile } from "@/lib/profile";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

/**
 * "Save my details for next time" — writes the tool's current landlord/property
 * fields into the saved profile (localStorage). Other tools then prefill from it.
 */
export function SaveDetailsButton({ getDetails }: { getDetails: () => SavedProfile }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        saveProfile(getDetails());
        track("profile_saved");
        setDone(true);
        setTimeout(() => setDone(false), 2500);
      }}
    >
      {done ? "Saved for next time ✓" : "Save my details for next time"}
    </Button>
  );
}
