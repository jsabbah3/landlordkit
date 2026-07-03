import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Prose } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "About LandlordKit — Who Runs This & How We Verify",
  description:
    "LandlordKit is an independent, founder-run project: free, statute-cited legal and financial tools for small landlords. Who's behind it, how the data is verified, and how to reach us.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="py-8">
      <Breadcrumbs crumbs={[{ name: "About", path: "/about" }]} />
      <article className="mt-4 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">About LandlordKit</h1>
        <Prose className="mt-6">
          <p>
            LandlordKit is built and run by <strong>Jake Sabbah</strong>, an
            independent landlord with a day job — the exact person these tools
            are for. It started as a set of spreadsheets for tracking the rules
            that actually bite small landlords (deposit deadlines, late-fee
            caps, filing dates) and became a public site when the
            &quot;free&quot; alternatives kept turning out to be ad farms,
            lead-capture walls, or simply wrong about state law.
          </p>

          <h2>The one rule everything here follows</h2>
          <p>
            <strong>We never publish a legal value we haven&apos;t verified.</strong>{" "}
            Every rule on this site cites its statute, links the source where
            available, and shows the date we last checked it. Where we
            haven&apos;t verified something yet, the site says so instead of
            guessing — you&apos;ll see &quot;not yet verified&quot; labels and
            confidence badges rather than confident-sounding filler. Laws
            change quietly (Florida&apos;s termination notice changed in 2023;
            Washington&apos;s rent-increase rules changed in 2025 — many sites
            still have both wrong), which is why the verification date matters
            as much as the value.
          </p>

          <h2>How it stays free</h2>
          <p>
            Every calculator and generator is free, without signup, forever —
            they run in your browser, so your numbers never touch a server.
            The site is paid for by{" "}
            <Link href="/pricing">LandlordKit Pro</Link>, a convenience layer
            for people with multiple units (saved details, batch documents,
            deadline reminders). No ads, no selling your data, no affiliate
            links dressed up as advice.
          </p>

          <h2>Contact</h2>
          <p>
            Questions, corrections, or press inquiries:{" "}
            <a href="mailto:jsabbah3@gmail.com">jsabbah3@gmail.com</a>. If you
            believe a value on this site is wrong, please say so — corrections
            get priority over everything else, and the{" "}
            <Link href="/press">press &amp; data page</Link> explains how to
            cite our datasets. LandlordKit provides general information, not
            legal advice.
          </p>
        </Prose>
      </article>
    </Container>
  );
}
