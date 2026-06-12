import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

/**
 * Site-wide default OpenGraph image (1200x630), generated at build time.
 * Pages can override later with their own opengraph-image if needed.
 */
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #122f26 0%, #1f6149 100%)",
          color: "#fbfaf7",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#f4b740",
              color: "#14201c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            L
          </div>
          <div style={{ fontSize: 56, fontWeight: 700 }}>{SITE.name}</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 44, lineHeight: 1.25, maxWidth: 980 }}>
          Free, accurate, state-aware tools for small landlords.
        </div>
        <div style={{ marginTop: 28, fontSize: 26, color: "#aed7c4" }}>
          Statute-cited calculators & documents · No signup · {SITE.url.replace("https://", "")}
        </div>
      </div>
    ),
    size,
  );
}
