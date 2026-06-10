-- ВЫПОЛНИТЬ В Supabase → SQL Editor (один раз).
-- Таблица лидов с сайта: записи на созвон из калькуляторов и CTA-кнопок.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- контакт
  name        text not null,
  phone       text,
  email       text,
  best_time   text,                 -- удобное время словами ("будни после 18:00")

  -- намерение
  intent      text not null,        -- 'buy' | 'sell' | 'invest'

  -- для продавца (sell)
  sell_address      text,
  sell_property_type text,           -- condo | house | townhouse | other
  sell_price_expect text,
  sell_has_mortgage text,            -- yes | no | unsure
  sell_timeline     text,            -- asap | 3m | 6m | exploring

  -- для покупателя/инвестора (buy / invest)
  buy_budget        text,
  buy_areas         text,
  buy_property_type text,
  buy_purpose       text,            -- live | invest

  -- снимок калькулятора (если запись пришла из калькулятора)
  calc_kind     text,                -- 'mortgage' | 'investment' | null
  calc_snapshot jsonb,               -- {price, downPct, rate, term, taxYr, insYr, hoaMo, result...}

  -- контекст
  source        text,                -- какая страница/CTA
  listing_ref   text,                -- адрес/id объекта, если со страницы листинга

  -- статус для админки
  status        text not null default 'new'  -- new | contacted | scheduled | closed
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_intent_idx  on public.leads (intent);

-- RLS: пишем/читаем только через service role (как contract_requests). Публичный доступ закрыт.
alter table public.leads enable row level security;
