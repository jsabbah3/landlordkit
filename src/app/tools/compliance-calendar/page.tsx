import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComplianceCalendarTool } from "@/components/tools/ComplianceCalendarTool";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareAppLd, howToLd, breadcrumbLd } from "@/lib/seo";
import { getProStatus } from "@/lib/pro";

export const dynamic = "force-dynamic"; // reads auth state

const PATH = "/tools/compliance-calendar";

export const metadata: Metadata = {
  title: "Landlord Compliance Calendar — Filing Deadlines Tracker",
  description:
    "Build a personalized calendar of the tax and compliance deadlines landlords must hit — federal (1099-NEC, Schedule E, estimated taxes), LLC filings, and local rules. Export to your calendar. Free.",
  alternates: { canonical: PATH },
};

export default async function Page() {
  const status = await getProStatus();
  return (
    <Container className="py-8">
      <JsonLd
        data={[
          softwareAppLd({
            name: "Landlord Compliance Calendar",
            description:
              "Personalized tracker of a landlord's recurring tax and compliance filing deadlines.",
            path: PATH,
          }),
          howToLd({
            name: "How to build your landlord compliance calendar",
            description:
              "Generate your personalized list of filing deadlines and export it to your calendar.",
            steps: [
              "Enter your state, city, entity type, and a few details.",
              "Review your personalized list of federal, state, and local deadlines.",
              "Add any custom deadlines we don't track for your area.",
              "Export to your calendar (.ics) so the dates appear in Google or Apple Calendar.",
            ],
          }),
          breadcrumbLd([
            { name: "Tools", path: "/tools" },
            { name: "Compliance Calendar", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Tools", path: "/tools" },
          { name: "Compliance Calendar", path: PATH },
        ]}
      />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Landlord Compliance Calendar
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          The filing and compliance deadlines landlords actually have to hit —
          federal, your state&apos;s LLC filings, and local rules — personalized
          to you and exportable to your calendar. Every item cites its source.
        </p>
      </header>
      <ComplianceCalendarTool signedIn={status.signedIn} />
    </Container>
  );
}
