-- 1) Crear nueva tabla limpia
drop table if exists public.recipes cascade;

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tags text[],
  ingredients jsonb,
  notes text,
  rating int,
  photo_url text,
  instructions text[] not null,
  prep_time_minutes int not null check (prep_time_minutes > 0 and prep_time_minutes <= 1440),
  servings smallint not null check (servings > 0 and servings <= 64),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Trigger para updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_recipes_updated_at
before update on public.recipes
for each row
execute function set_updated_at();

-- 3) Policies 
alter table public.recipes disable row level security;