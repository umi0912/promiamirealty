import { NextResponse } from "next/server";
import { listRequests } from "@/lib/requests";

// Список заявок для инбокса Ays. Защита простым паролем через заголовок.
function authed(req: Request) {
  const pass = process.env.ADMIN_PASSWORD || "promiami-demo";
  return req.headers.get("x-admin-pass") === pass;
}

export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const rows = await listRequests();
    return NextResponse.json({ ok: true, requests: rows });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
