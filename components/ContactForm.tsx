"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

export default function ContactForm() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({ name: "", email: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!data.name || !data.email) return;
    setBusy(true);
    try {
      await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setSent(true);
    } catch { setSent(true); }
    setBusy(false);
  };
  const inp: React.CSSProperties = { width: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)", padding: "12px 14px", fontSize: 15, outline: "none", marginBottom: 14, boxSizing: "border-box", fontFamily: "Inter" };
  if (sent) return (
    <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 20, fontFamily: "Fraunces, serif", marginBottom: 8 }}>{t("contact.sentTitle")}</div>
      <p style={{ color: "var(--muted)", fontSize: 15, margin: 0 }}>{t("contact.sentText")}</p>
    </div>
  );
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)", padding: 24 }}>
      <input style={inp} placeholder={t("contact.formName")} value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
      <input style={inp} placeholder={t("contact.formEmail")} type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
      <input style={inp} placeholder={t("contact.formPhone")} value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
      <textarea style={{ ...inp, minHeight: 110, resize: "vertical" }} placeholder={t("contact.formMsg")} value={data.message} onChange={e => setData({ ...data, message: e.target.value })} />
      <button onClick={submit} disabled={busy} style={{ width: "100%", background: "var(--coral)", color: "#fff", border: "none", padding: "14px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", opacity: busy ? 0.6 : 1, fontFamily: "Inter" }}>{busy ? t("contact.formSending") : t("contact.formSend")}</button>
    </div>
  );
}
