-- ============================================================
-- Índices en foreign keys — reducir Disk IO
-- ============================================================
-- Postgres no crea índices automáticos en columnas de foreign key
-- (solo en la primary key). Sin ellos, cada join por worker_id
-- (worker_services, availability, worker_badges, ratings) hace un
-- sequential scan completo de la tabla. useWorkers.js trae TODOS
-- los trabajadores verificados con esos 4 joins anidados en cada
-- carga de /trabajadores (la página más visitada), sin caché ni
-- paginación — eso multiplica la cantidad de disco leído por visita.
--
-- Supabase avisó por mail que el proyecto está agotando su Disk IO
-- Budget (plan de cómputo actual). Estos índices no cambian ningún
-- comportamiento, solo evitan los sequential scans repetidos.
--
-- También cubre check_recommendation_badge (001_initial_schema.sql),
-- que hace `select count(*) from ratings where worker_id = ...` en
-- cada insert/update de una calificación.

create index if not exists worker_services_worker_id_idx
  on worker_services (worker_id);

create index if not exists worker_services_category_id_idx
  on worker_services (service_category_id);

create index if not exists availability_worker_id_idx
  on availability (worker_id);

create index if not exists worker_badges_worker_id_idx
  on worker_badges (worker_id);

create index if not exists worker_badges_badge_id_idx
  on worker_badges (badge_id);

create index if not exists ratings_worker_id_idx
  on ratings (worker_id);

create index if not exists ratings_neighbor_id_idx
  on ratings (neighbor_id);

create index if not exists service_requests_worker_id_idx
  on service_requests (worker_id);

create index if not exists service_requests_neighbor_id_idx
  on service_requests (neighbor_id);

create index if not exists service_requests_category_id_idx
  on service_requests (service_category_id);
