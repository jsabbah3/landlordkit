"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/guides", label: "Guides" },
  { href: "/pricing", label: "Pro" },
];

/** Hamburger menu shown only on small screens. Closes when a link is tapped. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-11 w-11 place-items-center rounded-lg text-ink hover:bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <>
          {/* tap-away backdrop */}
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <nav className="absolute right-4 top-14 z-50 w-44 rounded-xl border border-line bg-white p-2 shadow-lg">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-paper-2"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
