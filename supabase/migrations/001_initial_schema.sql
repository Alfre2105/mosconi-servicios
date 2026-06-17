-- ============================================================
-- Mosconi Servicios — Esquema inicial
-- ============================================================

-- Extensiones
create extension if not exists "uuid-ossp";

-- ── Categorías de servicio ───────────────────────────────────
create table service_categories (
  id   uuid primary key default uuid_generate_v4(),
  name text not null unique
);

insert into service_categories (name) values
  ('Electricidad'),
  ('Plomería'),
  ('Jardinería'),
  ('Limpieza'),
  ('Carpintería'),
  ('Reparaciones generales'),
  ('Cuidado de personas'),
  ('Mudanzas'),
  ('Otro');

-- ── Vecinos ──────────────────────────────────────────────────
create type neighbor_role as enum ('neighbor', 'admin');

create table neighbors (
  id         uuid primary key default uuid_generate_v4(),
  full_name  text not null,
  phone      text not null unique,
  role       neighbor_role not null default 'neighbor',
  created_at timestamptz default now()
);

-- ── Trabajadores ─────────────────────────────────────────────
create table workers (
  id             uuid primary key default uuid_generate_v4(),
  full_name      text not null,
  phone          text not null,
  address        text,
  description    text,
  photo_url      text,
  accepts_rating boolean not null default true,
  is_verified    boolean not null default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- trigger updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger workers_updated_at
  before update on workers
  for each row execute function update_updated_at();

-- ── Servicios por trabajador ──────────────────────────────────
create table worker_services (
  worker_id           uuid references workers(id) on delete cascade,
  service_category_id uuid references service_categories(id) on delete cascade,
  primary key (worker_id, service_category_id)
);

-- ── Disponibilidad ────────────────────────────────────────────
create table availability (
  id        uuid primary key default uuid_generate_v4(),
  worker_id uuid references workers(id) on delete cascade unique,
  morning   boolean default false,
  afternoon boolean default false,
  night     boolean default false,
  weekend   boolean default false
);

-- ── Insignias ─────────────────────────────────────────────────
create table badges (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  description text
);

insert into badges (name, description) values
  ('Recomendado por vecinos', 'Tiene 10 o más calificaciones con 4 o más estrellas'),
  ('Confianza Mosconi',       'Verificado y avalado por la Asociación Vecinal');

create table worker_badges (
  worker_id   uuid references workers(id) on delete cascade,
  badge_id    uuid references badges(id) on delete cascade,
  assigned_at timestamptz default now(),
  primary key (worker_id, badge_id)
);

-- ── Calificaciones ────────────────────────────────────────────
create table ratings (
  id          uuid primary key default uuid_generate_v4(),
  worker_id   uuid references workers(id) on delete cascade,
  neighbor_id uuid references neighbors(id) on delete set null,
  stars       integer not null check (stars between 1 and 5),
  comment     text,
  is_visible  boolean not null default true,
  created_at  timestamptz default now()
);

-- Ocultar automáticamente calificaciones bajas
create or replace function hide_low_ratings()
returns trigger language plpgsql as $$
begin
  if new.stars <= 2 then
    new.is_visible = false;
  end if;
  return new;
end;
$$;

create trigger ratings_hide_low
  before insert on ratings
  for each row execute function hide_low_ratings();

-- ── Solicitudes de servicio ───────────────────────────────────
create type request_status as enum ('pendiente', 'aceptado', 'completado', 'cancelado');

create table service_requests (
  id                  uuid primary key default uuid_generate_v4(),
  neighbor_id         uuid references neighbors(id) on delete set null,
  worker_id           uuid references workers(id) on delete cascade,
  service_category_id uuid references service_categories(id) on delete set null,
  preferred_date      date,
  preferred_time      time,
  comment             text,
  status              request_status not null default 'pendiente',
  created_at          timestamptz default now()
);

-- ── Badge automático: "Recomendado por vecinos" ───────────────
create or replace function check_recommendation_badge()
returns trigger language plpgsql as $$
declare
  v_count integer;
  v_badge_id uuid;
begin
  select count(*) into v_count
    from ratings
   where worker_id = new.worker_id
     and is_visible = true
     and stars >= 4;

  if v_count >= 10 then
    select id into v_badge_id from badges where name = 'Recomendado por vecinos';
    insert into worker_badges (worker_id, badge_id)
      values (new.worker_id, v_badge_id)
      on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger ratings_check_badge
  after insert or update on ratings
  for each row execute function check_recommendation_badge();

-- ── Row Level Security ────────────────────────────────────────
alter table workers          enable row level security;
alter table neighbors        enable row level security;
alter table ratings          enable row level security;
alter table service_requests enable row level security;
alter table worker_services  enable row level security;
alter table availability     enable row level security;
alter table worker_badges    enable row level security;
alter table service_categories enable row level security;
alter table badges           enable row level security;

-- Lectura pública para tablas de catálogo
create policy "public read service_categories" on service_categories for select using (true);
create policy "public read badges"             on badges             for select using (true);

-- Lectura pública solo para trabajadores verificados
create policy "public read verified workers" on workers
  for select using (is_verified = true);

-- Admin puede leer todo en workers
create policy "admin read all workers" on workers
  for select using (auth.role() = 'authenticated');

-- Insertar trabajadores (registro libre)
create policy "anyone insert worker" on workers
  for insert with check (true);

-- Solo admins pueden actualizar/eliminar trabajadores
create policy "admin update workers" on workers
  for update using (auth.role() = 'authenticated');

create policy "admin delete workers" on workers
  for delete using (auth.role() = 'authenticated');

-- worker_services, availability, worker_badges: lectura pública
create policy "public read worker_services"  on worker_services  for select using (true);
create policy "public read availability"     on availability     for select using (true);
create policy "public read worker_badges"    on worker_badges    for select using (true);

-- Insertar disponibilidad y servicios (junto al registro)
create policy "anyone insert worker_services" on worker_services for insert with check (true);
create policy "anyone insert availability"    on availability    for insert with check (true);

-- Admin gestiona insignias
create policy "admin manage worker_badges" on worker_badges
  for all using (auth.role() = 'authenticated');

-- Calificaciones: visibles si is_visible = true
create policy "public read visible ratings" on ratings
  for select using (is_visible = true);

create policy "anyone insert rating"  on ratings for insert with check (true);
create policy "admin manage ratings"  on ratings for all   using (auth.role() = 'authenticated');

-- Vecinos: inserción libre, lectura admin
create policy "anyone insert neighbor"  on neighbors for insert with check (true);
create policy "anyone read neighbor"    on neighbors for select using (true);

-- Solicitudes: inserción libre, lectura admin
create policy "anyone insert request"   on service_requests for insert with check (true);
create policy "anyone read own request" on service_requests for select using (true);
create policy "admin manage requests"   on service_requests for all using (auth.role() = 'authenticated');
