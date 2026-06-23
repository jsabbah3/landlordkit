"use client";

import { useEffect, useMemo, useState } from "react";
import { US_STATES } from "@/lib/states";
import { longDate, todayISO } from "@/lib/format";
import { track } from "@/lib/analytics";
import {
  COVERED_CITIES,
  type ComplianceProfile,
  type EntityType,
} from "@/tools/compliance-calendar/obligations";
import { getObligations } from "@/tools/compliance-calendar/engine";
import { buildIcs, type CustomDeadline } from "@/tools/compliance-calendar/ical";
import { useProStatus } from "@/lib/useProStatus";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout, Badge } from "@/components/ui/Callout";
import { StatuteCitation } from "@/components/StatuteCitation";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";

const LS_KEY = "lk_compliance_v1";

interface Stored {
  profile: ComplianceProfile;
  custom: CustomDeadline[];
  completed: Record<string, string>;
}

const DEFAULT: Stored = {
  profile: {
    state: "NY", city: "new-york-city", entityType: "individual",
    usesContractors: false, builtPre1978: false, units: 1,
  },
  custom: [],
  completed: {},
};

export function ComplianceCalendarTool({ signedIn }: { signedIn: boolean }) {
  const { isPro } = useProStatus();
  const [data, setData] = useState<Stored>(DEFAULT);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const [feed, setFeed] = useState<{ webcal: string; url: string } | null>(null);
  const [feedState, setFeedState] = useState<"idle" | "loading" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const year = new Date().getFullYear();

  // Hydrate: localStorage first, then cloud (if signed in) wins.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration */
    try {
      const ls = localStorage.getItem(LS_KEY);
      if (ls) setData({ ...DEFAULT, ...JSON.parse(ls) });
    } catch {}
    if (signedIn) {
      fetch("/api/compliance-profile")
        .then((r) => r.json())
        .then((d) => { if (d?.profile?.profile) setData({ ...DEFAULT, ...d.profile }); })
        .catch(() => {});
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [signedIn]);

  const { profile, custom, completed } = data;
  const update = (patch: Partial<Stored>) => {
    const next = { ...data, ...patch };
    setData(next);
    setSaved("idle");
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };
  const setProfile = (p: Partial<ComplianceProfile>) =>
    update({ profile: { ...profile, ...p } });

  const obligations = useMemo(() => getObligations(profile), [profile]);
  const citiesForState = COVERED_CITIES.filter((c) => c.state === profile.state);

  async function saveCloud() {
    track("tool_used", { tool: "compliance-calendar" });
    if (!signedIn) return;
    setSaved("saving");
    try {
      await fetch("/api/compliance-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: data }),
      });
      setSaved("saved");
    } catch { setSaved("idle"); }
  }

  async function enableReminders() {
    setFeedState("loading");
    try {
      await saveCloud(); // persist current profile so the feed has content
      const res = await fetch("/api/compliance-feed", { method: "POST" });
      if (!res.ok) throw new Error();
      const body = (await res.json()) as { webcal: string; url: string };
      setFeed(body);
      setFeedState("idle");
      track("reminders_enabled", { tool: "compliance-calendar" });
    } catch {
      setFeedState("error");
    }
  }

  async function copyFeed() {
    if (!feed) return;
    try {
      await navigator.clipboard.writeText(feed.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the link is still selectable on screen */
    }
  }

  function downloadIcs() {
    const ics = buildIcs(obligations, custom);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "landlord-compliance-calendar.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    track("pdf_downloaded", { tool: "compliance-calendar", format: "ics" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* Profile */}
      <Card>
        <CardBody className="space-y-4">
          <p className="font-display text-lg font-semibold">Your profile</p>
          <Field label="State" htmlFor="cc-state">
            <Select id="cc-state" value={profile.state}
              onChange={(e) => setProfile({ state: e.target.value, city: COVERED_CITIES.find(c => c.state === e.target.value)?.slug ?? null })}>
              {US_STATES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
            </Select>
          </Field>
          <Field label="City" htmlFor="cc-city" hint="We track local rules for 12 cities. Not listed? Add a custom deadline below.">
            <Select id="cc-city" value={profile.city ?? ""}
              onChange={(e) => setProfile({ city: e.target.value || null })}>
              <option value="">Not listed / other</option>
              {citiesForState.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </Select>
          </Field>
          <Field label="How do you hold the property?" htmlFor="cc-entity">
            <Select id="cc-entity" value={profile.entityType}
              onChange={(e) => setProfile({ entityType: e.target.value as EntityType })}>
              <option value="individual">In my own name</option>
              <option value="llc">In an LLC</option>
            </Select>
          </Field>
          {profile.entityType === "llc" && (
            <Field label="LLC formation date" htmlFor="cc-formed" hint="Drives anniversary-based filings.">
              <Input id="cc-formed" type="date" value={profile.llcFormationDate ?? ""}
                onChange={(e) => setProfile({ llcFormationDate: e.target.value })} />
            </Field>
          )}
          <Field label="Number of units" htmlFor="cc-units">
            <Input id="cc-units" inputMode="numeric" value={String(profile.units)}
              onChange={(e) => setProfile({ units: Number(e.target.value) || 0 })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={profile.usesContractors}
              onChange={(e) => setProfile({ usesContractors: e.target.checked })} />
            I pay contractors $600+/year
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={profile.builtPre1978}
              onChange={(e) => setProfile({ builtPre1978: e.target.checked })} />
            Building was built before 1978
          </label>

          <div className="border-t border-line pt-4 flex flex-wrap gap-2">
            <Button onClick={downloadIcs} size="sm">Add to calendar (.ics)</Button>
            {signedIn ? (
              <Button variant="secondary" size="sm" onClick={saveCloud} disabled={saved === "saving"}>
                {saved === "saved" ? "Saved ✓" : saved === "saving" ? "Saving…" : "Save to my account"}
              </Button>
            ) : null}
          </div>
          {isPro && (
            <div className="border-t border-line pt-4">
              {!feed ? (
                <>
                  <p className="text-sm font-medium text-ink">Deadline reminders</p>
                  <p className="mt-1 text-sm text-ink/65">
                    Subscribe once and your calendar app will remind you 7 days
                    and 1 day before every deadline — on your phone too. It stays
                    in sync as your profile changes.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={enableReminders}
                    disabled={feedState === "loading"}
                  >
                    {feedState === "loading" ? "Setting up…" : "Get deadline reminders"}
                  </Button>
                  {feedState === "error" && (
                    <p className="mt-2 text-sm text-red-700">
                      Couldn&apos;t set that up — please try again.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-ink">
                    Reminders are ready 🎉
                  </p>
                  <p className="mt-1 text-sm text-ink/65">
                    Add this to your calendar app, then it&apos;ll alert you
                    before each deadline automatically.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={feed.webcal}
                      className="inline-flex h-9 items-center rounded-full bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
                    >
                      Subscribe in calendar
                    </a>
                    <Button variant="secondary" size="sm" onClick={copyFeed}>
                      {copied ? "Copied ✓" : "Copy link"}
                    </Button>
                  </div>
                  <p className="mt-2 break-all text-xs text-ink/45">{feed.url}</p>
                </>
              )}
            </div>
          )}
          {!signedIn && (
            <Callout tone="info">
              Your calendar is saved on this device. <strong>Pro</strong> saves it
              to your account (any device) and adds automatic deadline reminders
              to your calendar.
            </Callout>
          )}
        </CardBody>
      </Card>

      {/* Obligations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Your deadlines</h2>
          <Badge className="bg-brand-100 text-brand-800">{obligations.length} items</Badge>
        </div>

        {obligations.map(({ obligation: o, nextDue }) => {
          const done = completed[o.id] === String(year);
          return (
            <Card key={o.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">{o.title}</span>
                      <Badge className="bg-paper-2 text-ink/55 capitalize">{o.jurisdiction}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-ink/70">{o.what}</p>
                    <p className="mt-1 text-xs text-ink/55">File with: {o.fileWith}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-brand-700">
                      {nextDue ? longDate(nextDue) : "As needed"}
                    </p>
                    <label className="mt-1 flex items-center justify-end gap-1.5 text-xs text-ink/60">
                      <input type="checkbox" checked={done}
                        onChange={(e) => update({ completed: { ...completed, [o.id]: e.target.checked ? String(year) : "" } })} />
                      Done {year}
                    </label>
                  </div>
                </div>
                <div className="mt-2"><StatuteCitation cite={o.cite} /></div>
              </CardBody>
            </Card>
          );
        })}

        {/* Custom deadlines */}
        <CustomDeadlines custom={custom} onChange={(c) => update({ custom: c })} />
        <LegalDisclaimer />
      </div>
    </div>
  );
}

function CustomDeadlines({ custom, onChange }: { custom: CustomDeadline[]; onChange: (c: CustomDeadline[]) => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayISO());
  return (
    <Card>
      <CardBody className="space-y-3">
        <p className="font-display text-lg font-semibold">Add your own deadline</p>
        <p className="text-sm text-ink/60">For anything we don&apos;t track yet (e.g. your city&apos;s rental registration, property-tax due dates).</p>
        {custom.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg bg-paper-2 px-3 py-2 text-sm">
            <span>{c.title} — {longDate(c.date)} {c.recurrence === "annual" ? "(yearly)" : ""}</span>
            <button className="text-ink/45 hover:text-red-600" onClick={() => onChange(custom.filter((x) => x.id !== c.id))}>remove</button>
          </div>
        ))}
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Input placeholder="e.g. Chicago rental registration" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <Button size="sm" variant="secondary" disabled={!title.trim()}
          onClick={() => { onChange([...custom, { id: String(Date.now()), title: title.trim(), date, recurrence: "annual" }]); setTitle(""); }}>
          Add deadline
        </Button>
      </CardBody>
    </Card>
  );
}
