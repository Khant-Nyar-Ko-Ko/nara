import { ImageResponse } from "next/og";

// Link-preview card (LINE, Facebook, Messenger, X), rendered at build time.
export const alt = "NaraNews — Every Thai headline, one clean list";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(150deg,#182640,#091020)", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 44, fontWeight: 700 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 88, height: 88, borderRadius: 22, background: "linear-gradient(120deg,#d91d26,#c9411a)", fontSize: 56 }}>N</div>
          NaraNews
        </div>
        <div style={{ marginTop: 48, fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>Every Thai headline,</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>one clean list.</div>
        <div style={{ marginTop: 32, fontSize: 32, color: "#c1cada" }}>One-line summaries in your Chrome toolbar — or your inbox.</div>
      </div>
    ),
    size,
  );
}
