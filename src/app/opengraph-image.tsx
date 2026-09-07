import { ImageResponse } from "next/og";
export const alt = "Tami Bedford - music, sessions and creative work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", padding: 72, color: "#f4ecdf", background: "linear-gradient(135deg,#171512,#3b3329 58%,#8d2019)", fontFamily: "serif" }}><div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 24, letterSpacing: 8, textTransform: "uppercase" }}>Music / Sessions / Creative Studio</div><div style={{ marginTop: 18, fontSize: 88, fontWeight: 700 }}>Tami Bedford</div></div></div>, size);
}
