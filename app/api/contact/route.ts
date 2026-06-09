import { NextResponse } from "next/server";
import { notifyAgentNewLead } from "@/lib/email";

// Приём контактной формы → письмо агенту через Resend (reply-to = клиент).
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.name || !body?.email) {
      return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
    }
    await notifyAgentNewLead({
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      source: "Contact form",
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[contact] failed:", e?.message || e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
