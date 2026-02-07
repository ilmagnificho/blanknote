// app/icon.tsx
// 동적 Favicon 생성

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 20,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#000",
                    borderRadius: 4,
                }}
            >
                <span style={{ color: "#fff", fontWeight: "bold" }}>B</span>
                <span style={{ color: "#a855f7", fontWeight: "bold" }}>_</span>
            </div>
        ),
        {
            ...size,
        }
    );
}
