"use client";
import { useState, useEffect } from "react";

type Req = {
  id: string; created_at: string; kind: "review" | "prepare"; status: string;
  client_name: string; client_email: string; amount: number;
  file_url?: string; deal_data?: Record<string, string>; ai_draft?: any;
  final_text?: string; delivered_at?: string;
};

export default function Admin() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [reqs, setReqs] = useState<Req[]>([]);
  const [active, setActive] = useState<Req | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const load = async (p: string) => {
    const res = await fetch("/api/admin/requests", { headers: { "x-admin-pass": p } });
    if (res.status === 401) { setErr("Wrong password"); return false; }
    const data = await res.json();
    setReqs(data.requests || []);
    return true;
  };

  const login = async () => {
    setErr("");
    const ok = await load(pass);
    if (ok) setAuthed(true);
  };

  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => load(pass), 15000); // автообновление
    return () => clearInterval(t);
  }, [authed, pass]);

  const openReq = (r: Req) => {
    setActive(r);
    // префилл черновика для правки: из AI-результата делаем читаемый текст
    if (r.final_text) { setDraft(r.final_text); return; }
    if (r.kind === "review" && r.ai_draft?.findings) {
      const lines = r.ai_draft.findings.map((f: any) => `• ${f.label}: ${f.detail}`).join("\n");
      setDraft(`Contract review summary:\n\n${lines}\n\n— Reviewed by Ays Iziken, PRO MIAMI REALTY`);
    } else if (r.kind === "prepare" && r.ai_draft?.preview) {
      const lines = r.ai_draft.preview.map(([k, v]: [string, string]) => `${k}: ${v}`).join("\n");
      setDraft(`Contract draft:\n\n${lines}\n\n— Prepared by Ays Iziken, PRO MIAMI REALTY`);
    } else {
      setDraft("");
    }
  };

  const deliver = async () => {
    if (!active || !draft.trim()) return;
    setSending(true);
    const res = await fetch("/api/admin/deliver", {
      method: "POST", headers: { "Content-Type": "application/json", "x-admin-pass": pass },
      body: JSON.stringify({ id: active.id, final_text: draft }),
    });
    const data = await res.json();
    setSending(false);
    if (data.ok) { await load(pass); setActive(null); setDraft(""); }
    else setErr("Send failed: " + (data.error || ""));
  };

  const badge = (s: string) => {
    const map: Record<string, [string, string]> = { new: ["New", "var(--coral)"], in_review: ["In review", "var(--amber)"], delivered: ["Delivered", "var(--green)"] };
    const [label, c] = map[s] || [s, "var(--muted)"];
    return <span style={{ fontSize: 11, color: "#fff", background: c, padding: "3px 9px", borderRadius: 999 }}>{label}</span>;
  };

  const box: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: 18 };

  if (!authed) return (
    <div style={{ maxWidth: 380, margin: "0 auto", padding: "160px 24px 0" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Agent inbox</h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>Enter password to view contract requests.</p>
      <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="Password"
        style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "12px 14px", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 12, fontFamily: "Outfit" }} />
      <button onClick={login} style={{ width: "100%", background: "var(--coral)", color: "#fff", border: "none", padding: "13px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit" }}>Enter</button>
      {err && <p style={{ color: "#E2625C", fontSize: 13, marginTop: 12 }}>{err}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 24px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, margin: 0 }}>Contract requests</h1>
        <button onClick={() => load(pass)} style={{ background: "var(--surface-2)", color: "var(--text)", border: "none", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>↻ Refresh</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: active ? "1fr 1.3fr" : "1fr", gap: 20 }}>
        {/* LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reqs.length === 0 && <div style={{ ...box, textAlign: "center", color: "var(--muted)" }}>No requests yet.</div>}
          {reqs.map(r => (
            <div key={r.id} onClick={() => openReq(r)} style={{ ...box, cursor: "pointer", borderColor: active?.id === r.id ? "var(--coral)" : "var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>#{r.id} · {r.kind === "prepare" ? "Preparation" : "Review"}</span>
                {badge(r.status)}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{r.client_name} · {r.client_email}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>${r.amount} · {new Date(r.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* DETAIL */}
        {active && (
          <div style={box}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 18, margin: 0 }}>#{active.id} · {active.client_name}</h2>
              <button onClick={() => setActive(null)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
              {active.client_email} · ${active.amount}
              {active.file_url && <div style={{ marginTop: 4 }}>File: {active.file_url}</div>}
            </div>

            {/* AI DRAFT (read-only reference) */}
            <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>AI draft (reference)</div>
            <div style={{ background: "var(--bg)", borderRadius: 10, padding: 14, marginBottom: 18, maxHeight: 200, overflow: "auto" }}>
              {active.ai_draft?.findings?.map((f: any, i: number) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 8 }}><b style={{ color: "var(--text)" }}>{f.label}</b><div style={{ color: "var(--muted)" }}>{f.detail}</div></div>
              ))}
              {active.ai_draft?.preview?.map(([k, v]: [string, string], i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}><span style={{ color: "var(--muted)" }}>{k}</span><span>{v}</span></div>
              ))}
            </div>

            {active.status === "delivered" ? (
              <div style={{ background: "rgba(63,185,132,.12)", borderRadius: 10, padding: 14, fontSize: 13, color: "var(--text)" }}>
                ✓ Delivered to client {active.delivered_at && `· ${new Date(active.delivered_at).toLocaleString()}`}
              </div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Final message to client (edit before sending)</div>
                <textarea value={draft} onChange={e => setDraft(e.target.value)} style={{ width: "100%", minHeight: 180, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: 14, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "Outfit", lineHeight: 1.6 }} />
                <button onClick={deliver} disabled={sending || !draft.trim()} style={{ width: "100%", marginTop: 12, background: "var(--green)", color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", opacity: sending || !draft.trim() ? 0.5 : 1, fontFamily: "Outfit" }}>
                  {sending ? "Sending…" : "Review done → send to client"}
                </button>
                {err && <p style={{ color: "#E2625C", fontSize: 13, marginTop: 10 }}>{err}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
