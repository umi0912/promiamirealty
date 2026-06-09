import { NextResponse } from "next/server";

// AI-обработка контрактов. Режимы:
//  - "review"  — анализ загруженного контракта (находит пробелы/риски)
//  - "prepare" — черновик заполнения по данным сделки
// Сейчас работает в ДЕМО-режиме (без реального API), пока не задан ANTHROPIC_API_KEY.
// Везде human-in-the-loop: результат — ЧЕРНОВИК, финализирует лицензированный агент.

type ReviewInput = { mode: "review"; filename?: string; text?: string };
type PrepareInput = { mode: "prepare"; deal: Record<string, string> };

const DEMO_REVIEW = {
  summary: "Draft review — to be confirmed by a licensed agent.",
  findings: [
    { level: "warning", label: "Missing closing date", detail: "Section 3 (Closing) has no date entered. Buyer and seller must agree on a specific closing date." },
    { level: "warning", label: "Financing contingency blank", detail: "Loan amount and approval deadline aren't filled in. Leaving this blank weakens buyer protection." },
    { level: "info", label: "Earnest money", detail: "Deposit amount is present, but the escrow holder name is missing in Section 2." },
    { level: "info", label: "Inspection period", detail: "10-day inspection period noted — confirm this matches what the buyer expects." },
    { level: "ok", label: "Parties & property", detail: "Buyer, seller, and property address are filled in and consistent." },
  ],
  note: "This is an automated first pass. Ays Iziken reviews every result before it's sent to you.",
};

const DEMO_PREPARE = (deal: Record<string, string>) => ({
  summary: "Draft prepared — pending agent review.",
  preview: [
    ["Buyer", deal.buyer || "—"],
    ["Seller", deal.seller || "—"],
    ["Property", deal.property || "—"],
    ["Purchase price", deal.price ? `$${deal.price}` : "—"],
    ["Closing date", deal.closing || "—"],
    ["Earnest money", deal.earnest ? `$${deal.earnest}` : "—"],
  ],
  note: "Draft generated from your inputs. Ays Iziken finalizes the official form before delivery.",
});

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  let body: ReviewInput | PrepareInput;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  // ДЕМО-режим: ключа нет — отдаём реалистичный пример
  if (!key) {
    await new Promise(r => setTimeout(r, 900)); // имитация обработки
    if (body.mode === "prepare") return NextResponse.json({ ok: true, demo: true, result: DEMO_PREPARE(body.deal || {}) });
    return NextResponse.json({ ok: true, demo: true, result: DEMO_REVIEW });
  }

  // РЕАЛЬНЫЙ режим (активируется при наличии ANTHROPIC_API_KEY).
  // Здесь будет вызов Claude API: для review — анализ текста контракта,
  // для prepare — структурированный черновик. Структура ответа та же {ok, result}.
  // TODO: подключить @anthropic-ai/sdk и собрать prompt под FR/BAR формы.
  try {
    // placeholder until SDK wired up
    if (body.mode === "prepare") return NextResponse.json({ ok: true, demo: false, result: DEMO_PREPARE(body.deal || {}) });
    return NextResponse.json({ ok: true, demo: false, result: DEMO_REVIEW });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
