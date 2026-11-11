import { ImageResponse } from "next/og";

/**
 * Imagem que aparece quando alguém compartilha o site no WhatsApp ou nas redes.
 *
 * Sem ela, o link vira um retângulo cinza — e a maior parte do tráfego de uma
 * organização social chega por link colado em conversa.
 */
export const alt = "Instituto Educacional Araujo Dutra — há 10 anos semeando educação em Guadalupe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Imagem() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#e8e8da",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              backgroundColor: "#8c161a",
              color: "white",
              padding: "10px 24px",
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            2016 — 2026 · 10 ANOS
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 72,
              lineHeight: 1.1,
              color: "#1f2420",
              fontWeight: 700,
              maxWidth: 940,
            }}
          >
            Há 10 anos semeando educação, acolhimento e transformação social.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: "#8c161a" }}>
              Instituto Educacional Araujo Dutra
            </div>
            <div style={{ fontSize: 26, color: "#156110", marginTop: 6, letterSpacing: 1 }}>
              GUADALUPE · RIO DE JANEIRO
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: "#1c8214" }} />
            <div style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: "#8c161a" }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
