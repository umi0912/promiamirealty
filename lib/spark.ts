// Spark API / RESO Web API v3 integration — BeachesMLS IDX feed.
// Server-side only: токен живёт в process.env, наружу не уходит.
// Док: https://replication.sparkapi.com/Version/3/Reso/OData/
import type { Listing } from "./data";

const BASE = "https://replication.sparkapi.com/Version/3/Reso/OData/Property";
const TOKEN = process.env.SPARK_ACCESS_TOKEN || "";

// Округа, по которым лицензирован фид (Ays / BeachesMLS).
const COUNTIES = ["Miami-Dade", "Broward"];

// Типы PropertyType, считающиеся "for sale" (исключаем Lease/аренду, Commercial, Business).
const SALE_TYPES = ["Residential", "Residential Income", "Land & Docks"];

export const sparkEnabled = () => TOKEN.length > 0;

// Поля для списка (минимизируем payload).
const SELECT = [
  "ListingId", "ListPrice", "UnparsedAddress", "City", "StateOrProvince", "PostalCode",
  "BedroomsTotal", "BathroomsTotalInteger", "LivingArea", "PropertyType", "PropertySubType",
  "StandardStatus", "YearBuilt", "Latitude", "Longitude", "PublicRemarks",
  "ListOfficeName", "SeniorCommunityYN", "CountyOrParish",
].join(",");

// Доп. поля для детальной страницы (как у SERHANT: Additional information).
const DETAIL_SELECT = [
  SELECT,
  "AssociationFee", "AssociationFeeFrequency", "TaxAnnualAmount", "StoriesTotal",
  "BathroomsFull", "BathroomsHalf", "CoolingYN", "HeatingYN", "GarageSpaces", "GarageYN",
  "View", "SubdivisionName", "PoolPrivateYN", "ListingContractDate", "DaysOnMarket",
].join(",");

export type SearchParams = {
  q?: string;
  typeKey?: "all" | "condo" | "house" | "townhouse" | "land";
  beds?: number;
  baths?: number;
  minPrice?: number;
  maxPrice?: number;
  senior55?: boolean;
  status?: "active" | "coming" | "all";  // active = только Active; all = Active + Coming Soon
  page?: number;                          // 1-based
  pageSize?: number;                      // default 100
};

// PropertySubType (RESO) → наш typeKey/type.
function mapType(subType: string, propType: string): { typeKey: Listing["typeKey"]; type: Listing["type"] } {
  const s = (subType || "").toLowerCase();
  if ((propType || "").includes("Land") || s.includes("land") || s.includes("lot") || s.includes("dock")) return { typeKey: "land", type: "Land" };
  if (s.includes("condo") || s.includes("cooperative")) return { typeKey: "condo", type: "Condo" };
  if (s.includes("townhouse")) return { typeKey: "townhouse", type: "Townhouse" };
  return { typeKey: "house", type: "Single Family" };
}

// Экранирование одинарных кавычек для OData-строк.
const esc = (s: string) => s.replace(/'/g, "''");

function buildFilter(p: SearchParams): string {
  const clauses: string[] = [];

  // округа (всегда)
  clauses.push("(" + COUNTIES.map(c => `CountyOrParish eq '${c}'`).join(" or ") + ")");

  // статус
  if (p.status === "all") {
    clauses.push("(StandardStatus eq 'Active' or StandardStatus eq 'Coming Soon')");
  } else if (p.status === "coming") {
    clauses.push("StandardStatus eq 'Coming Soon'");
  } else {
    clauses.push("StandardStatus eq 'Active'");
  }

  // тип (с ограничением на "for sale" — без аренды)
  if (p.typeKey === "condo") clauses.push("PropertyType eq 'Residential' and (PropertySubType eq 'Condominium' or PropertySubType eq 'Stock Cooperative')");
  else if (p.typeKey === "house") clauses.push("PropertyType eq 'Residential' and PropertySubType eq 'Single Family Residence'");
  else if (p.typeKey === "townhouse") clauses.push("PropertyType eq 'Residential' and PropertySubType eq 'Townhouse'");
  else if (p.typeKey === "land") clauses.push("PropertyType eq 'Land & Docks'");
  else clauses.push("(" + SALE_TYPES.map(t => `PropertyType eq '${t}'`).join(" or ") + ")");

  if (p.beds && p.beds > 0) clauses.push(`BedroomsTotal ge ${p.beds}`);
  // BathroomsTotalInteger не фильтруется на сервере Spark — используем BathroomsTotalDecimal.
  if (p.baths && p.baths > 0) clauses.push(`BathroomsTotalDecimal ge ${p.baths}`);
  if (p.minPrice && p.minPrice > 0) clauses.push(`ListPrice ge ${p.minPrice}`);
  if (p.maxPrice && p.maxPrice < 99999999) clauses.push(`ListPrice le ${p.maxPrice}`);
  if (p.senior55) clauses.push("SeniorCommunityYN eq true");

  // текстовый поиск (адрес / город / zip)
  if (p.q && p.q.trim()) {
    const term = esc(p.q.trim().toLowerCase());
    clauses.push(
      `(contains(tolower(UnparsedAddress),'${term}') or contains(tolower(City),'${term}') or contains(PostalCode,'${term}'))`
    );
  }

  return clauses.join(" and ");
}

type ResoRecord = {
  ListingId: string; ListPrice: number; UnparsedAddress: string; City: string;
  StateOrProvince: string; PostalCode: string; BedroomsTotal: number;
  BathroomsTotalInteger: number; LivingArea: number; PropertyType: string;
  PropertySubType: string; StandardStatus: string; YearBuilt: number;
  Latitude: number; Longitude: number; PublicRemarks: string;
  ListOfficeName: string; SeniorCommunityYN: boolean;
  Media?: { MediaURL: string; MediaCategory: string; Order: number }[];
  // доп. поля (detail)
  AssociationFee?: number; AssociationFeeFrequency?: string; TaxAnnualAmount?: number;
  StoriesTotal?: number; BathroomsFull?: number; BathroomsHalf?: number;
  CoolingYN?: boolean; HeatingYN?: boolean; GarageSpaces?: number; GarageYN?: boolean;
  View?: string[]; SubdivisionName?: string; PoolPrivateYN?: boolean;
  ListingContractDate?: string; DaysOnMarket?: number;
};

// AssociationFee → месячный HOA (нормализуем по частоте).
function hoaToMonthly(fee?: number, freq?: string): number | undefined {
  if (!fee) return undefined;
  const f = (freq || "Monthly").toLowerCase();
  if (f.includes("year") || f.includes("annual")) return Math.round(fee / 12);
  if (f.includes("quarter")) return Math.round(fee / 3);
  if (f.includes("semi")) return Math.round(fee / 6);
  return Math.round(fee);
}

// Сборка таблицы "Additional information" из доступных полей.
function buildDetails(r: ResoRecord): { label: string; value: string }[] {
  const yn = (v?: boolean) => (v ? "Yes" : "No");
  const rows: ([string, string | number | undefined])[] = [
    ["Property type", r.PropertySubType],
    ["Total stories", r.StoriesTotal],
    ["Bedrooms", r.BedroomsTotal],
    ["Full bathrooms", r.BathroomsFull],
    ["Half bathrooms", r.BathroomsHalf],
    ["Cooling", r.CoolingYN === undefined ? undefined : yn(r.CoolingYN)],
    ["Heating", r.HeatingYN === undefined ? undefined : yn(r.HeatingYN)],
    ["Garage", r.GarageYN === undefined ? undefined : yn(r.GarageYN)],
    ["Garage spaces", r.GarageSpaces],
    ["Pool", r.PoolPrivateYN === undefined ? undefined : yn(r.PoolPrivateYN)],
    ["View", Array.isArray(r.View) && r.View.length ? r.View.join(", ") : undefined],
    ["Subdivision", r.SubdivisionName],
    ["Days on market", r.DaysOnMarket],
    ["County", undefined], // заполняется ниже из CountyOrParish если нужно
  ];
  return rows
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([label, value]) => ({ label, value: String(value) }));
}

// Фото листинга. MediaCategory === "Photo" исключает виртуальные туры.
// URL могут быть на разных хостах: cdn.photos.sparkplatform.com (часть бордов)
// или rets.sef.mlsmatrix.com (Matrix/Miami — с подписью ust= в URL). Оба валидны.
function extractPhotos(media: ResoRecord["Media"]): string[] {
  if (!media) return [];
  return media
    .filter(m => m.MediaCategory === "Photo" && /^https?:\/\//.test(m.MediaURL || ""))
    .sort((a, b) => (a.Order || 0) - (b.Order || 0))
    .map(m => m.MediaURL);
}

// Fallback-фото, если у листинга нет медиа.
const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80";

function mapRecord(r: ResoRecord, detail = false): Listing {
  const { typeKey, type } = mapType(r.PropertySubType, r.PropertyType);
  const photos = extractPhotos(r.Media);
  // адрес без города/штата в конце (UnparsedAddress часто = "318 Mansfield H, Boca Raton, FL 33434")
  const shortAddr = (r.UnparsedAddress || "").split(",")[0]?.trim() || r.UnparsedAddress || "";
  const base: Listing = {
    id: r.ListingId,
    mlsId: r.ListingId,
    price: r.ListPrice || 0,
    address: shortAddr,
    city: r.City || "",
    state: r.StateOrProvince || "FL",
    zip: r.PostalCode || "",
    type, typeKey,
    status: r.StandardStatus === "Coming Soon" ? "Coming Soon" : "Active",
    beds: r.BedroomsTotal || 0,
    baths: r.BathroomsTotalInteger || 0,
    sqft: Math.round(r.LivingArea || 0),
    yearBuilt: r.YearBuilt || 0,
    lat: r.Latitude || 0,
    lng: r.Longitude || 0,
    senior55: !!r.SeniorCommunityYN,
    courtesy: r.ListOfficeName ? `Courtesy of ${r.ListOfficeName}` : "Courtesy of BeachesMLS",
    description: r.PublicRemarks || "",
    photos: photos.length ? photos : [FALLBACK_PHOTO],
  };
  if (detail) {
    base.hoaMonthly = hoaToMonthly(r.AssociationFee, r.AssociationFeeFrequency);
    base.taxAnnual = r.TaxAnnualAmount || undefined;
    base.listedDate = r.ListingContractDate || undefined;
    base.details = buildDetails(r);
  }
  return base;
}

async function sparkGet(query: string): Promise<{ value: ResoRecord[]; count?: number }> {
  const res = await fetch(`${BASE}?${query}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" },
    next: { revalidate: 3600 }, // кэш 1 час (replication feed — разрешено)
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Spark API ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  return { value: json.value || [], count: json["@odata.count"] };
}

// total = -1 означает "точное число неизвестно" (режим 55+, см. ниже).
export type ListingsResult = { listings: Listing[]; total: number; page: number; pageSize: number; hasMore: boolean };

// Главный фетч для Search page — фильтры + пагинация + фото.
export async function getListings(p: SearchParams = {}): Promise<ListingsResult> {
  const pageSize = p.pageSize || 100;
  const page = p.page && p.page > 0 ? p.page : 1;
  const skip = (page - 1) * pageSize;
  const filter = buildFilter(p);

  const params = new URLSearchParams();
  params.set("$filter", filter);
  params.set("$select", SELECT);
  params.set("$expand", "Media($select=MediaURL,MediaCategory,Order)");
  params.set("$top", String(pageSize));
  params.set("$skip", String(skip));

  // SeniorCommunityYN не фильтруется на сервере Spark (eq игнорируется), но сортируется.
  // Ставим 55+ листинги первыми и пост-фильтруем после маппинга.
  if (p.senior55) {
    params.set("$orderby", "SeniorCommunityYN desc, ModificationTimestamp desc");
    const { value } = await sparkGet(params.toString());
    const senior = value.map(r => mapRecord(r)).filter(l => l.senior55);
    // Ещё есть 55+ дальше, только если вся страница состояла из 55+ (перехода к не-55+ ещё не было).
    const hasMore = value.length === pageSize && senior.length === value.length;
    return { listings: senior, total: -1, page, pageSize, hasMore };
  }

  params.set("$count", "true");
  params.set("$orderby", "ModificationTimestamp desc");
  const { value, count } = await sparkGet(params.toString());
  const total = count ?? value.length;
  return { listings: value.map(r => mapRecord(r)), total, page, pageSize, hasMore: page * pageSize < total };
}

// Один листинг по MLS ID — для detail-страницы.
export async function getListing(id: string): Promise<Listing | null> {
  const params = new URLSearchParams();
  params.set("$filter", `ListingId eq '${esc(id)}'`);
  params.set("$select", DETAIL_SELECT);
  params.set("$expand", "Media($select=MediaURL,MediaCategory,Order)");
  params.set("$top", "1");
  const { value } = await sparkGet(params.toString());
  return value.length ? mapRecord(value[0], true) : null;
}
