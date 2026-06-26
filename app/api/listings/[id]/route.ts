import { NextResponse } from "next/server";
import { getListing, sparkEnabled } from "@/lib/spark";
import { LISTINGS } from "@/lib/data";

// Один листинг по id — для detail-страницы. Сначала статика (демо), затем Spark.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const mock = LISTINGS.find(l => l.id === id);
  if (mock) return NextResponse.json({ listing: mock, source: "demo" });

  if (!sparkEnabled()) return NextResponse.json({ listing: null }, { status: 404 });

  try {
    const listing = await getListing(id);
    if (!listing) return NextResponse.json({ listing: null }, { status: 404 });
    return NextResponse.json({ listing, source: "spark" });
  } catch (e) {
    console.error("Spark listing detail error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ listing: null }, { status: 502 });
  }
}
