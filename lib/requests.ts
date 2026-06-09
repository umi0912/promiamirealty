import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Слой доступа к заявкам контракт-сервиса.
// Работает в двух режимах:
//   - РЕАЛЬНЫЙ: если заданы NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY → пишет в Supabase
//   - ДЕМО: если ключей нет → in-memory массив (данные живут до перезапуска сервера)
// Это позволяет видеть весь поток сразу, а на прод переключиться добавив ключи.

export type RequestStatus = "new" | "in_review" | "delivered";
export type ServiceKind = "review" | "prepare";

export interface ContractRequest {
  id: string;
  created_at: string;
  kind: ServiceKind;            // review ($50) | prepare ($100)
  status: RequestStatus;
  client_name: string;
  client_email: string;
  amount: number;               // 50 | 100
  // вход клиента:
  file_url?: string | null;     // PDF (для review)
  deal_data?: Record<string, string> | null; // данные сделки (для prepare)
  // результат AI (черновик):
  ai_draft?: any | null;
  // финал от Ays:
  final_text?: string | null;   // что Ays отправляет клиенту
  final_file_url?: string | null; // ответный PDF от Ays (опционально)
  delivered_at?: string | null;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const SUPABASE_READY = Boolean(url && serviceKey);

let _sb: SupabaseClient | null = null;
export function sb(): SupabaseClient {
  if (!_sb) _sb = createClient(url!, serviceKey!, { auth: { persistSession: false } });
  return _sb;
}

// ---- in-memory фолбэк (демо-режим) ----
const TABLE = "contract_requests";
const mem: ContractRequest[] = [];
const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export async function createRequest(input: Omit<ContractRequest, "id" | "created_at" | "status">): Promise<ContractRequest> {
  const row: ContractRequest = { ...input, id: uid(), created_at: new Date().toISOString(), status: "new" };
  if (SUPABASE_READY) {
    const { data, error } = await sb().from(TABLE).insert(row).select().single();
    if (error) throw error;
    return data as ContractRequest;
  }
  mem.unshift(row);
  return row;
}

export async function listRequests(): Promise<ContractRequest[]> {
  if (SUPABASE_READY) {
    const { data, error } = await sb().from(TABLE).select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as ContractRequest[];
  }
  return mem;
}

export async function getRequest(id: string): Promise<ContractRequest | null> {
  if (SUPABASE_READY) {
    const { data } = await sb().from(TABLE).select("*").eq("id", id).single();
    return (data as ContractRequest) || null;
  }
  return mem.find(r => r.id === id) || null;
}

export async function updateRequest(id: string, patch: Partial<ContractRequest>): Promise<ContractRequest | null> {
  if (SUPABASE_READY) {
    const { data, error } = await sb().from(TABLE).update(patch).eq("id", id).select().single();
    if (error) throw error;
    return data as ContractRequest;
  }
  const i = mem.findIndex(r => r.id === id);
  if (i === -1) return null;
  mem[i] = { ...mem[i], ...patch };
  return mem[i];
}

// ---- Файлы (Supabase Storage, bucket "contracts") ----
const BUCKET = "contracts";

// Загрузка файла. Возвращает путь внутри bucket (не публичный URL — bucket приватный).
export async function uploadContractFile(path: string, bytes: ArrayBuffer, contentType: string): Promise<string | null> {
  if (!SUPABASE_READY) return path; // демо: просто возвращаем путь-заглушку
  const { error } = await sb().storage.from(BUCKET).upload(path, bytes, { contentType, upsert: true });
  if (error) throw error;
  return path;
}

// Временная ссылка на скачивание приватного файла (signed URL, действует 1 час).
export async function signedFileUrl(path: string): Promise<string | null> {
  if (!SUPABASE_READY) return null;
  const { data, error } = await sb().storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) return null;
  return data?.signedUrl || null;
}
