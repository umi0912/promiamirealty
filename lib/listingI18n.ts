// Локализация значений листинга (статус/тип/доп.инфо приходят из MLS на английском).
// Свободный текст описания переводится отдельно через /api/translate (Claude).
type Lang = "en" | "ru";

const STATUS: Record<string, string> = {
  "active": "Активно",
  "coming soon": "Скоро в продаже",
  "active under contract": "Под контрактом",
  "pending": "Под контрактом",
  "closed": "Продано",
  "sold": "Продано",
  "canceled": "Снято",
  "cancelled": "Снято",
  "withdrawn": "Снято",
  "expired": "Истекло",
};

const TYPE: Record<string, string> = {
  "condo": "Квартира",
  "condominium": "Квартира",
  "house": "Дом",
  "single family": "Дом",
  "single family residence": "Дом",
  "residential": "Жильё",
  "townhouse": "Таунхаус",
  "townhomes": "Таунхаус",
  "villa": "Вилла",
  "land": "Участок",
  "lots and land": "Участок",
  "co-op": "Кооператив",
  "multi-family": "Многоквартирный",
  "apartment": "Квартира",
};

const DETAIL_LABEL: Record<string, string> = {
  "property type": "Тип объекта",
  "total stories": "Этажей всего",
  "bedrooms": "Спальни",
  "full bathrooms": "Полные санузлы",
  "half bathrooms": "Гостевые санузлы",
  "cooling": "Кондиционер",
  "heating": "Отопление",
  "garage": "Гараж",
  "garage spaces": "Мест в гараже",
  "pool": "Бассейн",
  "view": "Вид",
  "subdivision": "Район/комплекс",
  "days on market": "Дней в продаже",
  "county": "Округ",
};

// частые значения вида (View) из MLS
const VIEW: Record<string, string> = {
  "ocean": "Океан", "bay": "Залив", "water": "Вода", "intracoastal": "Интеркостал",
  "city": "Город", "garden": "Сад", "pool": "Бассейн", "lake": "Озеро",
  "canal": "Канал", "golf course": "Гольф-поле", "skyline": "Панорама города", "none": "Нет",
};

const norm = (s: string) => s.trim().toLowerCase();

export function localizeStatus(s: string, lang: Lang): string {
  if (lang === "en" || !s) return s;
  return STATUS[norm(s)] || s;
}
export function localizeType(s: string, lang: Lang): string {
  if (lang === "en" || !s) return s;
  return TYPE[norm(s)] || s;
}
export function localizeDetailLabel(label: string, lang: Lang): string {
  if (lang === "en" || !label) return label;
  return DETAIL_LABEL[norm(label)] || label;
}
// значения доп.инфо: Yes/No + виды + многосоставные виды через запятую
export function localizeDetailValue(value: string, lang: Lang): string {
  if (lang === "en" || !value) return value;
  const n = norm(value);
  if (n === "yes") return "Да";
  if (n === "no") return "Нет";
  // вид может быть «Ocean, Pool»
  if (value.includes(",")) {
    return value.split(",").map(v => VIEW[norm(v)] || v.trim()).join(", ");
  }
  // значение строки «Тип объекта» — это тип недвижимости
  return VIEW[n] || TYPE[n] || value;
}
