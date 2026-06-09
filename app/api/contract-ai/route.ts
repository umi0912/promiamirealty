import { NextResponse } from "next/server";
import { createRequest } from "@/lib/requests";
import { notifyAgentNewRequest } from "@/lib/email";

// Принимает оплаченную заявку, генерирует AI-черновик, сохраняет в БД,
// уведомляет Ays. Цикл: клиент → (оплата) → этот роут → заявка в инбоксе Ays.
// AI-часть пока в ДЕМО-режиме (см. ниже), переключается на реальный Claude API.

const DEMO_REVIEW = {
  summary: "Draft review — to be confirmed by a licensed agent.",
  findings: [
    { level: "warning", label: "Missing closing date", detail: "Section 3 (Closing) has no date entered." },
    { level: "warning", label: "Financing contingency blank", detail: "Loan amount and approval deadline aren't filled in." },
    { level: "info", label: "Earnest money", detail: "Deposit amount present, but escrow holder name missing in Section 2." },
    { level: "ok", label: "Parties & property", detail: "Buyer, seller, and property address are filled in and consistent." },
  ],
};
const DEMO_PREPARE = (deal: Record<string, string>) => ({
  summary: "Draft prepared — pending agent review.",
  preview: [
    ["Buyer", deal.buyer || "—"], ["Seller", deal.seller || "—"], ["Property", deal.property || "—"],
    ["Purchase price", deal.price ? `$${deal.price}` : "—"], ["Closing date", deal.closing || "—"], ["Earnest money", deal.earnest ? `$${deal.earnest}` : "—"],
  ],
});

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const kind = body.mode === "prepare" ? "prepare" : "review";
  const amount = kind === "prepare" ? 100 : 50;

  // 1. AI генерирует черновик (демо). TODO: реальный Claude API при ANTHROPIC_API_KEY.
  await new Promise(r => setTimeout(r, 700));
  const ai_draft = kind === "prepare" ? DEMO_PREPARE(body.deal || {}) : DEMO_REVIEW;

  // 2. Сохраняем заявку в БД (или in-memory в демо)
  let request;
  try {
    request = await createRequest({
      kind, amount,
      client_name: body.client_name || "Client",
      client_email: body.client_email || "",
      file_url: body.file_path || body.filename || null,
      deal_data: kind === "prepare" ? (body.deal || {}) : null,
      ai_draft,
      final_text: null,
      delivered_at: null,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "db" }, { status: 500 });
  }

  // 3. Уведомляем Ays (или лог в демо)
  try {
    await notifyAgentNewRequest({ id: request.id, kind, client_name: request.client_name, client_email: request.client_email, amount });
  } catch { /* email не должен ронять заявку */ }

  // 4. Клиенту — подтверждение + черновик на экран
  return NextResponse.json({ ok: true, requestId: request.id, result: ai_draft });
}
