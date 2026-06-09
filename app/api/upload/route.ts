import { NextResponse } from "next/server";
import { uploadContractFile } from "@/lib/requests";

// Загрузка PDF клиента. Принимает multipart form-data (поле "file").
// Кладёт в Supabase Storage (приватный bucket), возвращает путь.
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
    if (file.type !== "application/pdf") return NextResponse.json({ ok: false, error: "pdf_only" }, { status: 400 });
    if (file.size > 15 * 1024 * 1024) return NextResponse.json({ ok: false, error: "too_large" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `client/${Date.now()}_${safe}`;
    await uploadContractFile(path, bytes, "application/pdf");
    return NextResponse.json({ ok: true, path, name: file.name });
  } catch (e: any) {
    console.error("[upload] failed:", e?.message || e);
    return NextResponse.json({ ok: false, error: "upload_failed", detail: e?.message || String(e) }, { status: 500 });
  }
}
