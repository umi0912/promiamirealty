"use client";
import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/i18n";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPanel({ height = 480, showHeader = true }: { height?: number | string; showHeader?: boolean }) {
  const { lang } = useLang();
  const ru = lang === "ru";
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const greeting = ru
    ? "Здравствуйте! Я помощник PRO MIAMI REALTY. Спросите о покупке, продаже или инвестициях в недвижимость Майами."
    : "Hi! I'm the PRO MIAMI REALTY assistant. Ask me about buying, selling, or investing in Miami real estate.";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMsgs(m => [...m, { role: "assistant", content: data.reply || (ru ? "Извините, попробуйте ещё раз." : "Sorry, please try again.") }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: ru ? "Связь прервалась. Позвоните (305) 766-5513." : "Connection error. Please call (305) 766-5513." }]);
    }
    setBusy(false);
  };

  return (
    <div style={{ height, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {showHeader && (
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--coral)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15 }}>✦</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{ru ? "Чат с помощником" : "Chat with assistant"}</div>
            <div style={{ fontSize: 11, color: "var(--green)" }}>{ru ? "AI · онлайн" : "AI · online"}</div>
          </div>
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: "var(--surface-2)", borderRadius: 12, padding: "10px 13px", fontSize: 13.5, lineHeight: 1.5, color: "var(--text)", alignSelf: "flex-start", maxWidth: "85%" }}>{greeting}</div>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: m.role === "user" ? "var(--coral)" : "var(--surface-2)", color: m.role === "user" ? "#fff" : "var(--text)", borderRadius: 12, padding: "10px 13px", fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.content}</div>
        ))}
        {busy && <div style={{ alignSelf: "flex-start", color: "var(--muted)", fontSize: 13, padding: "4px 6px" }}>{ru ? "Печатает…" : "Typing…"}</div>}
        <div ref={endRef} />
      </div>
      <div style={{ borderTop: "1px solid var(--line)", padding: 12, display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(); }}
          placeholder={ru ? "Напишите сообщение…" : "Type a message…"}
          style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "Inter" }}
        />
        <button onClick={send} disabled={busy || !input.trim()} className="btn" style={{ background: "var(--coral)", color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", fontSize: 16, fontWeight: 500, cursor: "pointer", opacity: busy || !input.trim() ? 0.5 : 1 }}>→</button>
      </div>
    </div>
  );
}
