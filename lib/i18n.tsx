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
  "nav.services": { en: "Services", ru: "Услуги" },

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

  // home: stats + agent video
  "home.stats.eyebrow": { en: "Why work with us", ru: "Почему мы" },
  "home.stats.title": { en: "Local expertise, real results", ru: "Местная экспертиза, реальные результаты" },
  "home.stats.deals": { en: "Closed transactions", ru: "Закрытых сделок" },
  "home.stats.volume": { en: "In sales volume", ru: "Объём продаж" },
  "home.stats.cities": { en: "Cities served", ru: "Городов" },
  "home.stats.langs": { en: "Languages: EN · RU · ES", ru: "Языки: EN · RU · ES" },
  "home.agent.eyebrow": { en: "Meet your real estate broker", ru: "Ваш брокер по недвижимости" },
  "home.agent.title": { en: "A quick hello from Ays", ru: "Несколько слов от Ays" },
  "home.agent.text": { en: "Real estate is personal. Here's who you'll be working with — and how I think about helping you buy, sell, or invest in South Florida.", ru: "Недвижимость — это личное. Вот с кем вы будете работать и как я подхожу к помощи в покупке, продаже и инвестициях в Южной Флориде." },

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
  "footer.privacy": { en: "Privacy Policy", ru: "Политика конфиденциальности" },
  "footer.equal": { en: "Equal Housing Opportunity · Listings via BeachesMLS IDX", ru: "Equal Housing Opportunity · Объекты через BeachesMLS IDX" },

  // buyers
  "buyers.eyebrow": { en: "For buyers", ru: "Покупателям" },
  "buyers.title": { en: "Buy smart in a fast Miami market.", ru: "Покупайте с умом на быстром рынке Майами." },
  "buyers.sub": { en: "From first showing to closing day — clear numbers, honest advice, and a plan that fits your budget and timeline.", ru: "От первого показа до закрытия сделки — честные цифры, прямой совет и план под ваш бюджет и сроки." },
  "buyers.s1t": { en: "Get clear on budget", ru: "Определите бюджет" },
  "buyers.s1d": { en: "Estimate payments and get pre-approved so you shop with confidence.", ru: "Оцените платежи и получите предодобрение, чтобы выбирать уверенно." },
  "buyers.s2t": { en: "Tour with intent", ru: "Смотрите с целью" },
  "buyers.s2d": { en: "See the right homes, not every home — filtered to what fits.", ru: "Смотрите подходящие объекты, а не все подряд." },
  "buyers.s3t": { en: "Make a strong offer", ru: "Сильное предложение" },
  "buyers.s3d": { en: "Price it right and structure terms that win without overpaying.", ru: "Правильная цена и условия, которые выигрывают без переплат." },
  "buyers.s4t": { en: "Close with support", ru: "Закрытие с поддержкой" },
  "buyers.s4d": { en: "Inspections, financing, and paperwork — handled and explained.", ru: "Инспекции, финансирование и документы — под контролем и с объяснением." },
  "buyers.calcTitle": { en: "Estimate your monthly payment", ru: "Оцените ежемесячный платёж" },
  "buyers.calcSub": { en: "Try any price to see how down payment, rate, and term change the monthly number.", ru: "Введите любую цену и смотрите, как взнос, ставка и срок меняют платёж." },
  "buyers.invLink": { en: "Buying as an investment instead? See cap rates, cash flow, and income properties.", ru: "Покупаете как инвестицию? Смотрите доходность, денежный поток и доходные объекты." },
  "buyers.invCta": { en: "For investors →", ru: "Инвесторам →" },
  "buyers.ctaTitle": { en: "Ready to start your search?", ru: "Готовы начать поиск?" },
  "buyers.ctaText": { en: "Book a no-pressure consultation with Ays Iziken.", ru: "Запишитесь на консультацию без обязательств с Ays Iziken." },
  "step": { en: "Step", ru: "Шаг" },

  // sellers
  "sellers.eyebrow": { en: "For sellers", ru: "Продавцам" },
  "sellers.title": { en: "Sell for more, with less stress.", ru: "Продайте дороже и без стресса." },
  "sellers.sub": { en: "The right price, sharp presentation, and wide exposure — so your home sells on the best terms and timeline for you.", ru: "Правильная цена, сильная подача и широкий охват — чтобы продать на лучших условиях и в нужный срок." },
  "sellers.s1t": { en: "Price with data", ru: "Цена по данным" },
  "sellers.s1d": { en: "A pricing strategy built on real comps and current demand — not guesswork.", ru: "Ценообразование на реальных сделках и текущем спросе — без догадок." },
  "sellers.s2t": { en: "Prep & present", ru: "Подготовка и подача" },
  "sellers.s2d": { en: "Staging guidance and professional photos that make listings stand out.", ru: "Советы по стейджингу и профессиональные фото, чтобы объект выделялся." },
  "sellers.s3t": { en: "Market widely", ru: "Широкий охват" },
  "sellers.s3d": { en: "MLS, syndication, and targeted reach to the right buyers.", ru: "MLS, площадки и таргет на нужных покупателей." },
  "sellers.s4t": { en: "Negotiate & close", ru: "Переговоры и закрытие" },
  "sellers.s4d": { en: "Strong negotiation and a smooth path through to the closing table.", ru: "Сильные переговоры и гладкий путь до сделки." },
  "sellers.valTitle": { en: "What's your home worth?", ru: "Сколько стоит ваш дом?" },
  "sellers.valSub": { en: "Get a quick estimate now, then request a precise valuation built on recent comparable sales in your neighborhood.", ru: "Получите быструю оценку сейчас, затем запросите точную — на основе недавних продаж в вашем районе." },
  "sellers.freeTool": { en: "Free tool", ru: "Бесплатный инструмент" },
  "sellers.ctaTitle": { en: "Thinking about selling?", ru: "Думаете о продаже?" },
  "sellers.ctaText": { en: "Let's talk strategy, timing, and price — no pressure.", ru: "Обсудим стратегию, сроки и цену — без давления." },

  // about
  "about.eyebrow": { en: "About", ru: "Об агенте" },
  "about.p1": { en: "A Miami-based real estate professional with PRO MIAMI REALTY, helping buyers, sellers, and investors move with confidence across Miami-Dade and Broward.", ru: "Риелтор из Майами, компания PRO MIAMI REALTY. Помогаю покупателям, продавцам и инвесторам уверенно действовать в Miami-Dade и Broward." },
  "about.p2": { en: "From first-time buyers to seasoned investors, the approach is the same: clear guidance, honest numbers, and steady support from first showing to closing day.", ru: "От первых покупателей до опытных инвесторов подход один: понятное сопровождение, честные цифры и поддержка от первого показа до закрытия." },
  "about.v1t": { en: "Local", ru: "Местный" },
  "about.v1d": { en: "Miami-Dade & Broward focus", ru: "Фокус на Miami-Dade и Broward" },
  "about.v2t": { en: "Honest", ru: "Честный" },
  "about.v2d": { en: "Clear numbers, no pressure", ru: "Понятные цифры, без давления" },
  "about.v3t": { en: "Full-service", ru: "Полный сервис" },
  "about.v3d": { en: "Buy, sell & invest", ru: "Покупка, продажа, инвестиции" },
  "about.v4t": { en: "Responsive", ru: "На связи" },
  "about.v4d": { en: "A calm hand, start to close", ru: "Спокойное сопровождение до сделки" },

  // contact
  "contact.eyebrow": { en: "Contact", ru: "Контакты" },
  "contact.title": { en: "Let's talk.", ru: "Давайте обсудим." },
  "contact.sub": { en: "Questions about a listing, the market, or where to start? Send a note or book a time directly.", ru: "Вопросы по объекту, рынку или с чего начать? Напишите или сразу запишитесь." },
  "contact.formName": { en: "Your name", ru: "Ваше имя" },
  "contact.formEmail": { en: "Email", ru: "Email" },
  "contact.formPhone": { en: "Phone (optional)", ru: "Телефон (необязательно)" },
  "contact.formMsg": { en: "How can I help? Tell me what you're looking for.", ru: "Чем могу помочь? Расскажите, что ищете." },
  "contact.formSend": { en: "Send message", ru: "Отправить" },
  "contact.formSending": { en: "Sending…", ru: "Отправка…" },
  "contact.sentTitle": { en: "Message sent", ru: "Сообщение отправлено" },
  "contact.sentText": { en: "Thanks — you'll hear back shortly. For anything urgent, call directly.", ru: "Спасибо — скоро ответим. По срочным вопросам звоните напрямую." },
  "contact.pickTime": { en: "Or pick a time that works for you:", ru: "Или выберите удобное время:" },

  // investors
  "inv.eyebrow": { en: "For investors", ru: "Инвесторам" },
  "inv.title": { en: "Miami real estate that pays you back.", ru: "Недвижимость Майами, которая приносит доход." },
  "inv.sub": { en: "Cash-flowing rentals, clear numbers, and on-the-ground market insight — built for investors who buy on returns, not emotion.", ru: "Доходная аренда, понятные цифры и знание рынка — для инвесторов, которые покупают по доходности, а не по эмоциям." },
  "inv.analyze": { en: "Analyze a deal", ru: "Посчитать сделку" },
  "inv.seeProps": { en: "See income properties", ru: "Доходные объекты" },
  "inv.svcTitle": { en: "What working with an investor-focused agent looks like", ru: "Как работает агент с фокусом на инвестиции" },
  "inv.svcSub": { en: "Most agents sell homes. The focus here is returns — finding the deal and proving it works before you buy.", ru: "Большинство агентов просто продают. Здесь фокус на доходности — найти сделку и доказать её до покупки." },
  "inv.s1t": { en: "Find income properties", ru: "Поиск доходных объектов" },
  "inv.s1d": { en: "Off-market and on-market rentals screened for cash flow — not just what's listed, but what actually pencils out.", ru: "Объекты с рынка и вне рынка, отобранные по денежному потоку — не просто из листинга, а то, что реально работает." },
  "inv.s2t": { en: "Rental market analysis", ru: "Анализ рынка аренды" },
  "inv.s2d": { en: "Real rent comps by neighborhood, vacancy trends, and what tenants pay now — so projections hold up.", ru: "Реальные ставки аренды по районам, простой и что платят арендаторы — чтобы прогноз был точным." },
  "inv.s3t": { en: "Run the numbers together", ru: "Считаем вместе" },
  "inv.s3d": { en: "Cap rate, cash-on-cash, and monthly cash flow on every deal before you commit a dollar.", ru: "Доходность и денежный поток по каждой сделке — до того, как вы вложите доллар." },
  "inv.calcEyebrow": { en: "Deal analyzer", ru: "Анализ сделки" },
  "inv.calcTitle": { en: "Run any property's numbers", ru: "Посчитайте любой объект" },
  "inv.calcSub": { en: "Plug in price, rent, and expenses to see your monthly cash flow and return.", ru: "Введите цену, аренду и расходы — увидите денежный поток и доходность." },
  "inv.dealsEyebrow": { en: "Income properties", ru: "Доходные объекты" },
  "inv.dealsTitle": { en: "Rentals worth a look", ru: "Аренда, на которую стоит взглянуть" },
  "inv.estRent": { en: "Est. rent", ru: "Аренда ~" },
  "inv.ctaTitle": { en: "Looking for your next deal?", ru: "Ищете следующую сделку?" },
  "inv.ctaText": { en: "Tell Ays your target return and budget — get matched with properties that fit.", ru: "Назовите целевую доходность и бюджет — подберём подходящие объекты." },
  "inv.ctaBtn": { en: "Book an investor consultation", ru: "Записаться на инвест-консультацию" },
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
