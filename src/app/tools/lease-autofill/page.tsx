import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeaseUploadTool } from "@/components/tools/LeaseUploadTool";

const PATH = "/tools/lease-autofill";

export const metadata: Metadata = {
  title: "Lease Autofill — LandlordKit Pro",
  description:
    "Upload a lease PDF and autofill your landlord, tenant, property, rent, and deposit details. Read in your browser, never stored. A LandlordKit Pro feature.",
  alternates: { canonical: PATH },
  // Pro feature, gated client-side — keep it out of the index.
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Container className="py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Tools", path: "/tools" },
          { name: "Lease Autofill", path: PATH },
        ]}
      />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Lease autofill
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          Upload a lease and we&apos;ll pull out the details your tools need — no
          retyping. The PDF is read in your browser and never leaves your device;
          the lease text is used once to extract fields and is never stored.
        </p>
      </header>
      <LeaseUploadTool />
    </Container>
  );
}
