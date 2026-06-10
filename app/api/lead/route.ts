import { NextResponse } from "next/server";
import { createLead, LeadIntent } from "@/lib/leads";
import { notifyAgentNewBooking } from "@/lib/email";

// Приём записи на созвон из калькулятора / CTA.
// Пишет лид в Supabase (или in-memory демо) + шлёт письмо Ays со всеми данными ДО звонка.
export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b?.name || !b?.intent || !["buy", "sell", "invest"].includes(b.intent)) {
      return NextResponse.json({ ok: false, error: "missing name or intent" }, { status: 400 });
    }
    if (!b?.phone && !b?.email) {
      return NextResponse.json({ ok: false, error: "need phone or email" }, { status: 400 });
    }

    const lead = await createLead({
      name: String(b.name).slice(0, 120),
      phone: b.phone ? String(b.phone).slice(0, 40) : null,
      email: b.email ? String(b.email).slice(0, 160) : null,
      best_time: b.best_time ? String(b.best_time).slice(0, 120) : null,
      intent: b.intent as LeadIntent,
      sell_address: b.sell_address || null,
      sell_property_type: b.sell_property_type || null,
      sell_price_expect: b.sell_price_expect || null,
      sell_has_mortgage: b.sell_has_mortgage || null,
      sell_timeline: b.sell_timeline || null,
      buy_budget: b.buy_budget || null,
      buy_areas: b.buy_areas || null,
      buy_property_type: b.buy_property_type || null,
      buy_purpose: b.buy_purpose || null,
      calc_kind: b.calc_kind || null,
      calc_snapshot: b.calc_snapshot || null,
      source: b.source || "website",
      listing_ref: b.listing_ref || null,
    });

    try {
      await notifyAgentNewBooking(lead);
    } catch (e: any) {
      console.error("[lead] email failed:", e?.message || e);
      // лид уже сохранён — письмо не критично
    }

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e: any) {
    console.error("[lead] failed:", e?.message || e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
