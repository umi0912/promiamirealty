import { Resend } from "resend";

// Email через Resend. Без RESEND_API_KEY — пишет в консоль (демо).
// FROM должен быть на верифицированном в Resend домене (например notify@promiamirealty.com).

const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "PRO MIAMI REALTY <onboarding@resend.dev>";
const AGENT_EMAIL = process.env.AGENT_EMAIL || "info@promiamirealty.com";

export const EMAIL_READY = Boolean(KEY);

async function send(to: string, subject: string, html: string, replyTo?: string) {
  if (!KEY) {
    console.log(`[EMAIL demo] to=${to} subject="${subject}"`);
    return { demo: true };
  }
  const resend = new Resend(KEY);
  await resend.emails.send({ from: FROM, to, subject, html, ...(replyTo ? { replyTo } : {}) });
  return { demo: false };
}

// Ays: новая оплаченная заявка ждёт проверки
export async function notifyAgentNewRequest(req: { id: string; kind: string; client_name: string; client_email: string; amount: number }) {
  const adminUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://promiamirealty.com") + "/admin";
  const kindLabel = req.kind === "prepare" ? "Contract preparation ($100)" : "Contract review ($50)";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px">
      <h2 style="margin:0 0 12px">New paid request · #${req.id}</h2>
      <p style="margin:0 0 8px"><b>${kindLabel}</b></p>
      <table style="font-size:14px;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Client</td><td>${req.client_name}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${req.client_email}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Paid</td><td>$${req.amount}</td></tr>
      </table>
      <p style="margin:16px 0 0"><a href="${adminUrl}" style="background:#F2742C;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-size:14px">Open inbox →</a></p>
      <p style="font-size:12px;color:#999;margin-top:16px">An AI draft is attached to the request. Review it before sending to the client.</p>
    </div>`;
  return send(AGENT_EMAIL, `New request #${req.id} — ${kindLabel}`, html);
}

// Клиент: финальный результат от Ays
export async function deliverToClient(req: { id: string; kind: string; client_name: string; client_email: string }, finalText: string, fileLink?: string | null) {
  const isReview = req.kind === "review";
  const fileBlock = fileLink ? `
      <p style="margin:16px 0"><a href="${fileLink}" style="background:#F2742C;color:#fff;padding:11px 20px;border-radius:8px;text-decoration:none;font-size:14px">Download your document (PDF) →</a></p>
      <p style="font-size:11px;color:#999">Download link is valid for 7 days.</p>` : "";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">${isReview ? "Your contract review is ready" : "Your contract draft is ready"}</h2>
      <p style="margin:0 0 12px">Hi ${req.client_name}, here is the result, reviewed by Ays Iziken (PRO MIAMI REALTY, FL #3517956):</p>
      <div style="background:#f6f6f4;border-radius:10px;padding:18px;font-size:14px;line-height:1.7;white-space:pre-wrap">${finalText.replace(/</g, "&lt;")}</div>
      ${fileBlock}
      <p style="font-size:13px;color:#666;margin-top:16px">Questions? Reply to this email or call (305) 766-5513.</p>
      <p style="font-size:11px;color:#999;margin-top:8px">Request #${req.id}</p>
    </div>`;
  return send(req.client_email, isReview ? "Your contract review — PRO MIAMI REALTY" : "Your contract draft — PRO MIAMI REALTY", html);
}

// Новый лид с контактной формы → письмо агенту (reply-to = email клиента)
export async function notifyAgentNewLead(lead: { name: string; email: string; phone?: string; message?: string; source?: string }) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">New website lead${lead.source ? ` · ${lead.source}` : ""}</h2>
      <table style="font-size:14px;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td>${lead.name}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${lead.email}</td></tr>
        ${lead.phone ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Phone</td><td>${lead.phone}</td></tr>` : ""}
      </table>
      ${lead.message ? `<p style="margin:14px 0 0;color:#666;font-size:13px">Message:</p><div style="background:#f6f6f4;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;white-space:pre-wrap">${lead.message.replace(/</g, "&lt;")}</div>` : ""}
      <p style="font-size:12px;color:#999;margin-top:16px">Reply directly to this email to respond to the client.</p>
    </div>`;
  return send(AGENT_EMAIL, `New lead — ${lead.name}`, html, lead.email);
}
