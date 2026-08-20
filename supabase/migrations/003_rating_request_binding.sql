-- ============================================================
-- Atar las calificaciones a una solicitud de servicio completada
-- ============================================================
-- Antes: cualquiera podía calificar a un trabajador desde su perfil
-- público (/calificar/:worker_id), sin que existiera un servicio real.
-- Ahora: calificar requiere una service_request puntual, completada,
-- y sin calificación previa. El link se genera solo al marcar el
-- trabajo como completado (ver CompleteRequest.jsx).

alter table ratings
  add column if not exists request_id uuid references service_requests(id) on delete set null;

-- Una sola calificación por solicitud (evita reusar el mismo link
-- de WhatsApp para inflar/hundir el promedio). No aplica a las
-- calificaciones históricas (request_id null), que quedan como están.
create unique index if not exists ratings_request_id_unique
  on ratings (request_id)
  where request_id is not null;

-- La inserción libre ("with check (true)") era el hueco real: aunque
-- se saque el botón de la UI, la anon key es pública en el bundle del
-- cliente y cualquiera podía insertar directo contra la API de
-- Supabase. Ahora el insert solo es válido si referencia una solicitud
-- real, completada, del mismo worker.
drop policy if exists "anyone insert rating" on ratings;

create policy "insert rating for completed own request" on ratings
  for insert
  with check (
    request_id is not null
    and exists (
      select 1 from service_requests sr
      where sr.id = ratings.request_id
        and sr.worker_id = ratings.worker_id
        and sr.status = 'completado'
    )
  );
