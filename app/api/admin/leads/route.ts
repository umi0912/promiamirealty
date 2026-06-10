import { NextResponse } from "next/server";
import { listLeads } from "@/lib/leads";

function authed(req: Request) {
  const pass = process.env.ADMIN_PASSWORD || "promiami-demo";
  return req.headers.get("x-admin-pass") === pass;
}

export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const rows = await listLeads();
    return NextResponse.json({ ok: true, leads: rows });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
