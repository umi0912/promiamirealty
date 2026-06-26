# PRO MIAMI REALTY — promiamirealty.com

Сайт и автоматизация для брокера Ays Iziken (PRO MIAMI REALTY LLC, Miramar, FL).
Позиционирование Ays: **«Real estate broker & investor»** — не просто realtor.
Два равнозначных value prop: (1) investor mindset — находит недооценённые сделки
для покупателей / продаёт дороже для продавцов; (2) защита интересов клиента через
сильное чтение контрактов.

## Стек
- Next.js (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Vercel (auto-deploy при пуше)
- Supabase (БД: leads, dotloop_tokens)
- Resend (email)
- Stripe

## Дизайн
- Референс: **SERHANT.com** — равняемся на него по качеству.
- Палитра: indigo `#2e1a4a`. (Идёт пересмотр цвета — возможны варианты, уточняй у меня.)
- Шрифты: Space Grotesk + Manrope.
- Стиль header: тёмная indigo pill, видимые nav-ссылки, белый текст.
- Hero-текст белый поверх фото (Sellers/Buyers/Investors).
- НЕТ eyebrow-лейблов (убраны через display:none).
- Sellers использует inverse (тёмные indigo) секции — этот паттерн распространяем
  на Buyers/Investors/home.

## ЖЁСТКИЕ ПРАВИЛА

### 1. Ветки
- Вся работа на ветке **`redesign-v3`**.
- НИКОГДА не трогать production **`main`** без явного разрешения.
- Merge в main — только когда я скажу, что редизайн одобрен.

### 2. Секреты — репозиторий ПУБЛИЧНЫЙ
- НИКОГДА не хардкодить ключи/токены в коде.
- Все секреты живут ТОЛЬКО в Vercel env:
  - `SPARK_ACCESS_TOKEN` (BeachesMLS / Spark IDX)
  - `NEXT_PUBLIC_MAPBOX_TOKEN` (карта на Search)
  - Supabase / Resend / Stripe ключи
  - DotLoop client_id/secret
- В коде обращаться через `process.env.*`, не вставлять значения.

### 3. Файлы — осторожно с подменой
- Рядом есть другие проекты (`~/dev/crm-v2`, salon-checklist) со своими `page.tsx`.
- Не путать файлы. Работаем строго в этом репо.
- Перед коммитом проверять, что правится нужный файл:
  `head -3 app/page.tsx`

### 4. IDX / Spark — соответствие правилам
- Разрешён feed «BeachesMLS Agent/Broker Licensed Feed - IDX» (Ays, flr.3517956).
- Endpoint: `https://replication.sparkapi.com/Version/3/Reso/OData/` (RESO Web API v3).
- Auth: Access Token в header.
- Server-side рендеринг и кэширование листингов — РАЗРЕШЕНО (replication feed).
- ЗАПРЕЩЕНО: скрейпинг, перепродажа, модификация данных, шаринг креденшелов.
- ОБЯЗАТЕЛЬНО: дисклеймеры и атрибуция источника («Courtesy of …» на карточках).

## ТЕКУЩЕЕ СОСТОЯНИЕ (что готово / что нет)

### Готово
- Визуальный редизайн redesign-v3 (палитра, шрифты, header, hero, статистика с глобусом).
- Lead-capture v25: LeadModal (Buy/Sell/Invest), таблица Supabase `leads`,
  `/api/lead` (Resend), Calendly prefill, секция Call requests в `/admin`.

### Собрано в песочнице, НЕ запушено
- Search page: мультиселект-чипы типа жилья, min/max цена, baths, фильтр 55+,
  Mapbox GL JS карта (light-v11), price-пины, кластеры, fitBounds, click→листинг.
- Нужен `NEXT_PUBLIC_MAPBOX_TOKEN` в Vercel.

### Не сделано (первый этап)
- Search page довести до уровня SERHANT: sticky filter-bar, pill-фильтры
  (City search, For sale, Any price, All property types, All beds, All baths,
  List/Map toggle, All filters, Save search), grid карточек 3-в-ряд со
  статус-бейджами (Active/Coming soon), heart+share, courtesy-атрибуцией,
  цена→bd/ba/sqft→адрес→MLS#.
- Live IDX интеграция через SPARK_ACCESS_TOKEN (сейчас листинги — моки в `lib/data.ts`).
- Позиционирование «broker & investor» на home/About/hero.
- Inverse-секции на Buyers/Investors/home.
- Google Business: полная настройка профиля (пункт ТЗ договора).
- Корпоративная почта + фирменная email-подпись (пункт ТЗ договора).
- Investment Calculator (Web App) — расширенный вариант договора.
- Supabase: прогнать миграцию `supabase_leads.sql`, подтвердить env в Vercel.

### DotLoop — Step 1 готов, ждём Step 2 (ВТОРОЙ ЭТАП, не текущий контракт)
- Аккаунт `api@promiamirealty.com` создан, ждём активацию V2 API (client_id/secret).
- Архитектура: OAuth2 в Next.js (НЕ n8n), refresh-token в Supabase `dotloop_tokens`,
  helper `getValidDotloopToken` с оптимистичной блокировкой (избегаем 401 при
  параллельном refresh).
- Contract-service AI-автоматизация (DotLoop template-fill, AI-draft) —
  ОТДЕЛЬНЫЙ платный второй этап, ВНЕ текущего контракта.

### n8n
- Зарезервирован ТОЛЬКО под pre-foreclosure pipeline (отдельная система, второй этап).

## КАК Я РАБОТАЮ
- Общение по-русски, технические термины по-английски.
- Прямо и честно, без AI-филлера. Не приукрашивай оценки.
- Объясняй решения, не уводи в воду.
- Перед пушем — всегда проверка правильного файла (`head -3` / `grep -c`).
- `git apply` часто падает из-за расхождений — надёжнее прямая замена файла + ручной commit.
