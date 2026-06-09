"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "ru";

// Словарь: ключи группами по страницам. Добавляй пары en/ru.
export const DICT = {
  // nav
  "nav.home": { en: "Home", ru: "Главная" },
  "nav.search": { en: "Search", ru: "Поиск" },
  "nav.buyers": { en: "Buyers", ru: "Покупателям" },
  "nav.sellers": { en: "Sellers", ru: "Продавцам" },
  "nav.investors": { en: "Investors", ru: "Инвесторам" },
  "nav.about": { en: "About", ru: "Об агенте" },
  "nav.contact": { en: "Contact", ru: "Контакты" },
  "nav.cities": { en: "Cities", ru: "Города" },

  // home hero
  "home.eyebrow": { en: "Miami-Dade · Broward · South Florida", ru: "Miami-Dade · Broward · Южная Флорида" },
  "home.title": { en: "Find your place under the Miami sun.", ru: "Найдите своё место под солнцем Майами." },
  "home.subtitle": { en: "Live MLS listings, sharp local insight, and a calm hand from search to closing — with Ays Iziken.", ru: "Живые объекты из MLS, знание местного рынка и спокойное сопровождение от поиска до сделки — с Ays Iziken." },
  "home.cta.search": { en: "Search listings", ru: "Смотреть объекты" },
  "home.cta.book": { en: "Book a consultation", ru: "Записаться на консультацию" },
  "home.featured.eyebrow": { en: "Featured", ru: "Избранное" },
  "home.featured.title": { en: "Signature residences", ru: "Знаковые объекты" },
  "home.viewall": { en: "View all →", ru: "Смотреть все →" },
  "home.inv.eyebrow": { en: "Investors — our focus", ru: "Инвесторам — наш фокус" },
  "home.inv.title": { en: "Miami real estate that pays you back.", ru: "Недвижимость Майами, которая приносит доход." },
  "home.inv.text": { en: "Cash-flowing rentals, full deal analysis, and rental-market insight. Cap rate, cash-on-cash, and monthly cash flow on every property — before you buy.", ru: "Доходная аренда, полный анализ сделки и знание рынка аренды. Cap rate, доходность на капитал и денежный поток по каждому объекту — до покупки." },
  "home.inv.cta": { en: "Explore investing →", ru: "Перейти к инвестициям →" },
  "home.calc.eyebrow": { en: "Plan ahead", ru: "Планируйте заранее" },
  "home.calc.title": { en: "Know your numbers before you fall in love.", ru: "Посчитайте цифры до того, как влюбитесь в объект." },
  "home.calc.text": { en: "Estimate a monthly payment on any price, then book time to talk strategy — financing, neighborhoods, and timing.", ru: "Оцените ежемесячный платёж для любой цены, затем запишитесь обсудить стратегию — финансирование, районы и сроки." },
  "home.consult.title": { en: "Let's talk", ru: "Давайте обсудим" },
  "home.consult.text": { en: "Pick a time that works — no pressure, just answers.", ru: "Выберите удобное время — без давления, только ответы." },

  // common
  "common.bookConsult": { en: "Book a consultation", ru: "Записаться на консультацию" },
  "common.getInTouch": { en: "Get in touch", ru: "Связаться" },
  "common.allListings": { en: "All listings →", ru: "Все объекты →" },

  // footer
  "footer.tagline": { en: "Buying, selling, and investing across Miami-Dade and Broward — guided by local expertise.", ru: "Покупка, продажа и инвестиции в Miami-Dade и Broward — с опорой на знание местного рынка." },
  "footer.explore": { en: "Explore", ru: "Разделы" },
  "footer.contact": { en: "Contact", ru: "Контакты" },
  "footer.connect": { en: "Connect", ru: "Связь" },
  "footer.rights": { en: "All rights reserved.", ru: "Все права защищены." },
  "footer.equal": { en: "Equal Housing Opportunity · Listings via BeachesMLS IDX", ru: "Equal Housing Opportunity · Объекты через BeachesMLS IDX" },
} as const;

export type DictKey = keyof typeof DICT;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string }>({
  lang: "en", setLang: () => {}, t: (k) => DICT[k]?.en ?? k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "en" || saved === "ru") setLangState(saved);
    } catch {}
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  };
  const t = (k: DictKey) => DICT[k]?.[lang] ?? DICT[k]?.en ?? k;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
