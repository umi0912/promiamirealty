"use client";
import { useState } from "react";

export default function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", maxWidth: 820 }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderTop: i ? "1px solid var(--line)" : "none" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "18px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 600, color: "var(--text)", fontFamily: "inherit" }}
          >
            <span>{it.q}</span>
            <span style={{ fontSize: 24, color: "var(--coral)", lineHeight: 1, transition: "transform .2s", transform: open === i ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
          </button>
          {open === i && <div style={{ padding: "0 20px 18px", fontSize: 15, color: "var(--muted)", lineHeight: 1.7 }}>{it.a}</div>}
        </div>
      ))}
    </div>
  );
}
