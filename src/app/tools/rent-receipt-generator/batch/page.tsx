import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BatchRentReceiptTool } from "@/components/tools/BatchRentReceiptTool";

const PATH = "/tools/rent-receipt-generator/batch";

export const metadata: Metadata = {
  title: "Batch Rent Receipts — LandlordKit Pro",
  description:
    "Generate a rent receipt for every unit in one click — one watermark-free PDF, one receipt per page. A LandlordKit Pro feature.",
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
          { name: "Rent Receipt", path: "/tools/rent-receipt-generator" },
          { name: "Batch", path: PATH },
        ]}
      />
      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Batch rent receipts
        </h1>
        <p className="mt-3 text-lg text-ink/70">
          Set the shared details once, list your units, and download one
          watermark-free PDF with a receipt per unit — ideal for the 1st of the
          month.
        </p>
      </header>
      <BatchRentReceiptTool />
    </Container>
  );
}
