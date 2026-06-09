-- ============================================================
-- PRO MIAMI REALTY — схема для контракт-сервиса
-- Прогнать один раз в Supabase → SQL Editor → New query → Run
-- ============================================================

create table if not exists contract_requests (
  id            text primary key,
  created_at    timestamptz not null default now(),
  kind          text not null check (kind in ('review','prepare')),
  status        text not null default 'new' check (status in ('new','in_review','delivered')),
  client_name   text not null,
  client_email  text not null,
  amount        numeric not null,
  file_url      text,
  deal_data     jsonb,
  ai_draft      jsonb,
  final_text    text,
  delivered_at  timestamptz
);

create index if not exists contract_requests_status_idx on contract_requests (status);
create index if not exists contract_requests_created_idx on contract_requests (created_at desc);

-- Row Level Security: включаем, но доступ только через service_role (серверные роуты).
-- Публичный anon-ключ к таблице доступа НЕ имеет — заявки видны только бэкенду и инбоксу.
alter table contract_requests enable row level security;

-- (Опционально) хранилище загруженных PDF:
-- Supabase → Storage → New bucket → name: "contracts", Public: OFF (приватный).
-- Серверный роут будет грузить файлы через service_role ключ.

-- ОБНОВЛЕНИЕ (если таблица уже создана ранее): добавить колонку для ответного PDF агента
alter table contract_requests add column if not exists final_file_url text;
