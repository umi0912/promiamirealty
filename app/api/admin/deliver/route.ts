import { NextResponse } from "next/server";
import { getRequest, updateRequest, signedFileUrl } from "@/lib/requests";
import { deliverToClient } from "@/lib/email";

function authed(req: Request) {
  const pass = process.env.ADMIN_PASSWORD || "promiami-demo";
  return req.headers.get("x-admin-pass") === pass;
}

// Ays финализирует: правит черновик/прикладывает PDF и отправляет клиенту.
export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const { id, final_text } = body;
  if (!id || !final_text) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });

  const reqRow = await getRequest(id);
  if (!reqRow) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  // если приложен ответный PDF — генерируем ссылку на скачивание (7 дней)
  let fileLink: string | null = null;
  if (reqRow.final_file_url) {
    fileLink = await signedFileUrl(reqRow.final_file_url);
  }

  // 1. отправляем клиенту email с финалом (+ ссылка на PDF, если есть)
  try {
    await deliverToClient(
      { id: reqRow.id, kind: reqRow.kind, client_name: reqRow.client_name, client_email: reqRow.client_email },
      final_text,
      fileLink
    );
  } catch {
    return NextResponse.json({ ok: false, error: "email" }, { status: 500 });
  }

  // 2. помечаем доставленной
  const updated = await updateRequest(id, { status: "delivered", final_text, delivered_at: new Date().toISOString() });
  return NextResponse.json({ ok: true, request: updated });
}
