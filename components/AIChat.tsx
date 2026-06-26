"use client";
import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 60 }}>
      {open && (
        <div style={{ position: "absolute", bottom: 70, right: 0, width: 360, maxWidth: "calc(100vw - 48px)", boxShadow: "0 20px 50px -12px rgba(0,0,0,.6)", borderRadius: 16 }}>
          <ChatPanel height="min(480px, calc(100vh - 140px))" />
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Chat" style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--coral)", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", boxShadow: "0 6px 20px rgba(44,90,80,.4)" }}>{open ? "✕" : "✦"}</button>
    </div>
  );
}
