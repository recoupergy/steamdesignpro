import { ImageResponse } from "next/og";

export const alt = "SteamDesignPro free 3D steam shower planner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#f4f8f8",
        color: "#10282a",
        fontFamily: "sans-serif",
        padding: "64px",
      }}
    >
      <div style={{ width: "44%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, fontWeight: 700 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#10383a", color: "#63d5d0", display: "flex", alignItems: "center", justifyContent: "center" }}>S</div>
          SteamDesignPro
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#087879", fontSize: 22, textTransform: "uppercase", letterSpacing: "0.12em" }}>Free 3D steam-shower planner</div>
          <div style={{ fontSize: 58, lineHeight: 1.01, fontWeight: 700, marginTop: 20 }}>See it before the tile goes up.</div>
          <div style={{ fontSize: 24, color: "#4c6263", marginTop: 24 }}>Design the room, size the system, and share the plan.</div>
        </div>
      </div>
      <div style={{ flex: 1, marginLeft: 52, borderRadius: 20, background: "#dce8e8", border: "2px solid #b9cccc", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", width: 420, height: 420, transform: "rotateX(58deg) rotateZ(-35deg)", background: "#fff", border: "4px solid #c8d4d4", display: "flex" }} />
        <div style={{ position: "absolute", right: 70, bottom: 110, width: 32, height: 32, borderRadius: 16, background: "#d3a04d" }} />
        <div style={{ position: "absolute", left: 100, bottom: 95, width: 230, height: 65, background: "#eff4f3", border: "3px solid #93a9a9" }} />
        <div style={{ marginBottom: 36, color: "#087879", fontSize: 19, fontWeight: 700 }}>ROOM MODEL • LIVE SIZING • PDF RECORD</div>
      </div>
    </div>,
    size,
  );
}
