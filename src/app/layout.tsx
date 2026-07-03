import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ExitIntentCapture } from "@/components/ExitIntentCapture";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// Display serif used only for headings/wordmark. Keep the weight list tight —
// every weight is an extra font file in the LCP path on the homepage hero.
const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    // No static title/description here: Next falls back to each page's own
    // title/description for og:title/og:description, so shared links (reports,
    // state hubs) get page-specific cards instead of the generic homepage one.
  },
  twitter: { card: "summary_large_image", site: SITE.twitter },
  robots: { index: true, follow: true },
  // Google Search Console "HTML tag" verification. Set GOOGLE_SITE_VERIFICATION
  // in Vercel and redeploy, then click Verify. Accepts either the bare token OR
  // the full <meta ... content="TOKEN" ...> tag (we extract the token), so a
  // copy-paste mistake can't produce a malformed tag.
  verification: googleVerification()
    ? { google: googleVerification() }
    : undefined,
};

function googleVerification(): string | undefined {
  const raw = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  if (!raw) return undefined;
  const fromTag = raw.match(/content=["']?([^"'>\s]+)/i);
  return (fromTag ? fromTag[1] : raw) || undefined;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ExitIntentCapture />
      </body>
    </html>
  );
}
