import { NextResponse } from "next/server";
import { signedFileUrl, uploadContractFile, getRequest, updateRequest } from "@/lib/requests";

function authed(req: Request) {
  const pass = process.env.ADMIN_PASSWORD || "promiami-demo";
  return req.headers.get("x-admin-pass") === pass;
}

export const runtime = "nodejs";

// GET ?path=... → временная ссылка на скачивание файла клиента
export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  if (!path) return NextResponse.json({ ok: false }, { status: 400 });
  const signed = await signedFileUrl(path);
  if (!signed) return NextResponse.json({ ok: false, error: "no_url" }, { status: 404 });
  return NextResponse.json({ ok: true, url: signed });
}

// POST multipart (file + id) → агент загружает ответный PDF, сохраняем в заявку
export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const id = form.get("id") as string | null;
    if (!file || !id) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
    if (file.type !== "application/pdf") return NextResponse.json({ ok: false, error: "pdf_only" }, { status: 400 });

    const reqRow = await getRequest(id);
    if (!reqRow) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

    const bytes = await file.arrayBuffer();
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `final/${id}_${Date.now()}_${safe}`;
    await uploadContractFile(path, bytes, "application/pdf");
    await updateRequest(id, { final_file_url: path });
    return NextResponse.json({ ok: true, path });
  } catch {
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 500 });
  }
}
