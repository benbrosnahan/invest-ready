import { ImageResponse } from "next/og";

// The share card, drawn at build time. Plain system type: no font is fetched.
export const alt = "Invest Ready by Cense: five questions on whether you are ready to start investing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RUNGS = ["Money coming in", "No debt above 8%", "A cushion", "Time to grow", "A mix you can hold"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFFCEC", padding: 72, color: "#275B2D" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
            <span style={{ color: "#A8531F" }}>Cense</span>
            <span style={{ marginLeft: 12 }}>Invest Ready</span>
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 48, maxWidth: 560 }}>
            Are you ready to start investing?
          </div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 28, color: "#3A6B3E", maxWidth: 560 }}>
            Five questions. A yes or a not yet, and one next step.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 420 }}>
          {RUNGS.map((r, i) => (
            <div key={r} style={{ display: "flex", alignItems: "center", marginTop: i === 0 ? 0 : 26 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  background: i < 4 ? "#275B2D" : "#F7E4D6",
                  border: i < 4 ? "3px solid #275B2D" : "3px solid #C1652E",
                  color: i < 4 ? "#FFFCEC" : "#A8531F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                {i < 4 ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFCEC" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  "5"
                )}
              </div>
              <div style={{ display: "flex", marginLeft: 20, fontSize: 30, fontWeight: 600 }}>{r}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
