-- ============================================================
-- Insignia de confianza (badge_status) + graduación automática
-- ============================================================

alter table workers
  add column if not exists badge_status text not null default 'nuevo'
    check (badge_status in ('nuevo', 'verificado'));

-- Graduar automáticamente de "nuevo" a "verificado" cuando el
-- trabajador reúne 5+ calificaciones visibles con promedio >= 4
create or replace function check_badge_graduation()
returns trigger language plpgsql
security definer set search_path = public as $$
declare
  v_count integer;
  v_avg numeric;
begin
  select count(*), coalesce(avg(stars), 0)
    into v_count, v_avg
    from ratings
   where worker_id = new.worker_id
     and is_visible = true;

  if v_count >= 5 and v_avg >= 4 then
    update workers
       set badge_status = 'verificado'
     where id = new.worker_id
       and badge_status = 'nuevo';
  end if;

  return new;
end;
$$;

drop trigger if exists ratings_check_graduation on ratings;
create trigger ratings_check_graduation
  after insert or update on ratings
  for each row execute function check_badge_graduation();

-- Fix preexistente: este trigger (de 001_initial_schema.sql) nunca pudo
-- otorgar la insignia "Recomendado por vecinos" en producción porque
-- corría con los permisos de quien inserta la reseña (rol anon), y la
-- política RLS de worker_badges solo permite escribir al rol authenticated.
create or replace function check_recommendation_badge()
returns trigger language plpgsql
security definer set search_path = public as $$
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
