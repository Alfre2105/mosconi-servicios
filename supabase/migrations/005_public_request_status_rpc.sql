-- ============================================================
-- Permitir que el trabajador (anónimo, sin login) marque una
-- solicitud como aceptada/completada, sin abrir UPDATE libre
-- ============================================================
-- Bug real detectado: service_requests solo tenía una policy de
-- UPDATE ("admin manage requests", auth.role() = 'authenticated').
-- AcceptRequest.jsx y CompleteRequest.jsx corren como anon (el
-- trabajador nunca inicia sesión) y hacían update() directo contra
-- la tabla. RLS filtraba la fila silenciosamente (0 filas afectadas,
-- sin error), así que la UI mostraba éxito y se mandaban los mails,
-- pero el status real se quedaba en 'pendiente' para siempre. Por
-- eso /calificar/:id nunca encontraba la solicitud en 'completado'.
--
-- En vez de agregar una policy de UPDATE abierta a anon (que
-- permitiría, vía un PATCH directo a la API, cambiar worker_id o
-- neighbor_id de cualquier solicitud con solo saber su UUID — el
-- mismo tipo de hueco que ya se cerró para ratings en la migración
-- 003), se usan funciones security definer bien acotadas: solo
-- mueven `status` hacia adelante, ningún otro campo.

create or replace function accept_service_request(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update service_requests
  set status = 'aceptado'
  where id = p_id
    and status = 'pendiente';
end;
$$;

create or replace function complete_service_request(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update service_requests
  set status = 'completado'
  where id = p_id
    and status in ('pendiente', 'aceptado');
end;
$$;

grant execute on function accept_service_request(uuid) to anon, authenticated;
grant execute on function complete_service_request(uuid) to anon, authenticated;
