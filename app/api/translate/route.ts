import { NextResponse } from "next/server";

// Перевод свободного текста (описание листинга из MLS) на русский через Claude.
// Без ANTHROPIC_API_KEY — возвращает оригинал (graceful). Кэш в памяти инстанса.
export const runtime = "nodejs";
export const maxDuration = 30;

const cache = new Map<string, string>();

export async function POST(req: Request) {
  let text = "", target = "ru";
  try {
    const body = await req.json();
    text = typeof body.text === "string" ? body.text : "";
    target = body.target === "en" ? "en" : "ru";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!text.trim()) return NextResponse.json({ ok: true, text });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || target === "en") return NextResponse.json({ ok: true, text, translated: false });

  const ck = `${target}:${text}`;
  const hit = cache.get(ck);
  if (hit) return NextResponse.json({ ok: true, text: hit, translated: true, cached: true });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: "You are a professional real-estate translator. Translate the user's property description into natural, fluent Russian. Keep it polished and concise. Preserve proper nouns (building names, neighborhoods, brands, malls, airports) and numbers as-is. Output ONLY the translation, no preamble, no quotes.",
        messages: [{ role: "user", content: text }],
      }),
    });
    const data = await res.json();
    const out = data?.content?.find((c: any) => c.type === "text")?.text?.trim() || "";
    if (!out) return NextResponse.json({ ok: true, text, translated: false });
    cache.set(ck, out);
    return NextResponse.json({ ok: true, text: out, translated: true });
  } catch (e: any) {
    console.error("[translate] failed:", e?.message || e);
    return NextResponse.json({ ok: true, text, translated: false });
  }
}
