import { SUPABASE_READY, sb } from "@/lib/requests";

// Слой доступа к лидам (записи на созвон). Тот же приём, что в requests.ts:
//   - РЕАЛЬНЫЙ режим если заданы ключи Supabase → таблица public.leads
//   - ДЕМО режим без ключей → in-memory (до перезапуска)

export type LeadIntent = "buy" | "sell" | "invest";
export type LeadStatus = "new" | "contacted" | "scheduled" | "closed";

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  best_time?: string | null;
  intent: LeadIntent;

  sell_address?: string | null;
  sell_property_type?: string | null;
  sell_price_expect?: string | null;
  sell_has_mortgage?: string | null;
  sell_timeline?: string | null;

  buy_budget?: string | null;
  buy_areas?: string | null;
  buy_property_type?: string | null;
  buy_purpose?: string | null;

  calc_kind?: string | null;
  calc_snapshot?: Record<string, any> | null;

  source?: string | null;
  listing_ref?: string | null;
  status: LeadStatus;
}

const TABLE = "leads";
const mem: Lead[] = [];
const uid = () => Math.random().toString(36).slice(2, 10);

export async function createLead(input: Omit<Lead, "id" | "created_at" | "status">): Promise<Lead> {
  if (SUPABASE_READY) {
    const { data, error } = await sb().from(TABLE).insert(input).select().single();
    if (error) throw error;
    return data as Lead;
  }
  const row: Lead = { ...input, id: uid(), created_at: new Date().toISOString(), status: "new" };
  mem.unshift(row);
  return row;
}

export async function listLeads(): Promise<Lead[]> {
  if (SUPABASE_READY) {
    const { data, error } = await sb().from(TABLE).select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as Lead[];
  }
  return mem;
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  if (SUPABASE_READY) {
    const { data, error } = await sb().from(TABLE).update(patch).eq("id", id).select().single();
    if (error) throw error;
    return data as Lead;
  }
  const i = mem.findIndex((r) => r.id === id);
  if (i === -1) return null;
  mem[i] = { ...mem[i], ...patch };
  return mem[i];
}
