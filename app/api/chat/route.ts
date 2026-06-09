import { NextResponse } from "next/server";

// AI-чат ассистент PRO MIAMI REALTY через Claude API.
// Без ANTHROPIC_API_KEY — отвечает понятной заглушкой (направляет к Calendly/телефону).
export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM = `You are the assistant for PRO MIAMI REALTY, a licensed real estate brokerage in Miramar, Florida (agent Ays Iziken, FL License #3517956), serving Miami-Dade and Broward counties.

Your job: answer visitor questions about buying, selling, and investing in South Florida real estate, explain how the agency helps, and guide serious visitors to book a consultation (Calendly) or call (305) 766-5513.

Rules:
- Reply in the SAME language the user writes in (English or Russian).
- Be concise, warm, professional. 2-4 sentences usually.
- You are NOT a licensed agent — for specific legal/financial/contract advice, recommend booking a consultation with Ays.
- Never invent specific listings, prices, or legal facts. If asked for current listings, point them to the Search page.
- For contract review/preparation, mention the agency offers a paid contract service on the site.
- If someone wants to proceed, encourage booking via the consultation link or calling.`;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  let messages: { role: string; content: string }[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Демо-режим без ключа
  if (!key) {
    const lastUser = [...messages].reverse().find(m => m.role === "user")?.content || "";
    const ru = /[а-яА-Я]/.test(lastUser);
    const demo = ru
      ? "Спасибо за вопрос! Чтобы ответить точно по вашей ситуации, лучше записаться на короткую консультацию с Ays — нажмите «Записаться» на сайте или позвоните (305) 766-5513."
      : "Thanks for your question! For an accurate answer to your situation, the best next step is a quick consultation with Ays — use the booking link on the site or call (305) 766-5513.";
    return NextResponse.json({ ok: true, reply: demo, demo: true });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: SYSTEM,
        messages: messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
      }),
    });
    const data = await res.json();
    const reply = data?.content?.find((c: any) => c.type === "text")?.text || "";
    if (!reply) return NextResponse.json({ ok: false, error: "no_reply" }, { status: 502 });
    return NextResponse.json({ ok: true, reply });
  } catch (e: any) {
    console.error("[chat] failed:", e?.message || e);
    return NextResponse.json({ ok: false, error: "chat_failed" }, { status: 500 });
  }
}
