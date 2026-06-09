import { NextResponse } from "next/server";

// Приём контактной формы. Email-доставка на info@promiamirealty.com
// подключается через провайдера (Resend/SendGrid) при деплое — ключ в env.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO при запуске: отправка письма на AGENT.email через провайдера.
    console.log("Contact submission:", body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
