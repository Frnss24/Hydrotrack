-- Skema Database Neon PostgreSQL untuk HydroTrack
-- Jalankan seluruh query ini di SQL Editor Neon (https://console.neon.tech)

create extension if not exists pgcrypto;

create table if not exists beverage_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists beverages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid references beverage_categories(id) on delete set null,
  hydration_index integer default 100,
  recommended_ml integer default 250,
  calories_per_250ml integer default 0,
  best_time text default 'Sepanjang hari',
  description text,
  benefits jsonb default '[]'::jsonb,
  tips jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists hydration_logs (
  id uuid primary key default gen_random_uuid(),
  user_identifier text not null,
  beverage_name text not null,
  category text default 'Air Mineral',
  amount_ml integer not null check (amount_ml > 0),
  consumed_at timestamptz default now(),
  mood text default 'Segar',
  notes text,
  created_at timestamptz default now()
);

insert into beverage_categories (name) values
  ('Air Murni'),
  ('Infused & Herbal'),
  ('Elektrolit Alami'),
  ('Minuman Hangat')
on conflict (name) do nothing;
