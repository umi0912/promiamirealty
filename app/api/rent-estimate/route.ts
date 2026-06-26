import { NextResponse } from "next/server";
import { getRentEstimate, sparkEnabled } from "@/lib/spark";

// Рыночная оценка аренды по lease-компам (город + спальни). null если нет данных.
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const city = sp.get("city") || "";
  const beds = parseInt(sp.get("beds") || "0", 10);
  if (!sparkEnabled() || !city || !beds) return NextResponse.json({ rent: null });
  try {
    const rent = await getRentEstimate(city, beds);
    return NextResponse.json({ rent });
  } catch {
    return NextResponse.json({ rent: null });
  }
}
