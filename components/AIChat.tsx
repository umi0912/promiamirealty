"use client";
import { useState } from "react";

// AI-чат: подключается виджет агента (agent_4e08fcac1ef5d3c70baca72f32).
// Здесь — плавающая кнопка-заглушка; реальный embed добавим, когда подтвердим платформу.
export default function AIChat() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 60 }}>
      {open && (
        <div style={{ position: "absolute", bottom: 70, right: 0, width: 320, background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 18, boxShadow: "0 10px 40px rgba(0,0,0,.4)" }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Ask about Miami real estate</div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>AI assistant connecting… (agent widget embeds here)</p>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Chat" style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--coral)", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", boxShadow: "0 6px 20px rgba(216,90,48,.4)" }}>{open ? "✕" : "✦"}</button>
    </div>
  );
}
