import { NextResponse } from "next/server";
import { getListings, sparkEnabled, type SearchParams } from "@/lib/spark";
import { LISTINGS } from "@/lib/data";

// Live IDX листинги для Search page. Токен Spark остаётся на сервере.
// Если SPARK_ACCESS_TOKEN не задан или API упал — отдаём демо-данные (graceful fallback).
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const num = (k: string, d: number) => { const v = parseInt(sp.get(k) || "", 10); return isNaN(v) ? d : v; };

  const params: SearchParams = {
    q: sp.get("q") || undefined,
    typeKey: (sp.get("type") as SearchParams["typeKey"]) || "all",
    beds: num("beds", 0),
    baths: num("baths", 0),
    minPrice: num("minPrice", 0),
    maxPrice: num("maxPrice", 99999999),
    senior55: sp.get("senior55") === "1",
    status: (sp.get("status") as SearchParams["status"]) || "active",
    page: num("page", 1),
    pageSize: 100,
  };

  if (!sparkEnabled()) {
    const mock = filterMock(params);
    return NextResponse.json({ listings: mock, total: mock.length, page: 1, pageSize: 100, hasMore: false, source: "demo" });
  }

  try {
    const result = await getListings(params);
    return NextResponse.json({ ...result, source: "spark" });
  } catch (e) {
    // API ошибка — не роняем страницу, отдаём демо.
    console.error("Spark listings error:", e instanceof Error ? e.message : e);
    const mock = filterMock(params);
    return NextResponse.json({ listings: mock, total: mock.length, page: 1, pageSize: 100, hasMore: false, source: "demo-fallback" });
  }
}

// Клиентская фильтрация демо-данных (тот же контракт, что и Spark).
function filterMock(p: SearchParams) {
  const term = (p.q || "").trim().toLowerCase();
  return LISTINGS.filter(l => {
    const m = !term || l.address.toLowerCase().includes(term) || l.city.toLowerCase().includes(term) || l.zip.includes(term);
    return m
      && (p.typeKey === "all" || !p.typeKey || l.typeKey === p.typeKey)
      && l.beds >= (p.beds || 0)
      && l.baths >= (p.baths || 0)
      && l.price >= (p.minPrice || 0)
      && l.price <= (p.maxPrice || 99999999)
      && (!p.senior55 || l.senior55);
  });
}
