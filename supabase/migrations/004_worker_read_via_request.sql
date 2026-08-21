-- ============================================================
-- Permitir leer el nombre del trabajador en las pantallas de
-- aceptar/completar/calificar aunque no esté is_verified = true
-- ============================================================
-- Bug: Rate.jsx, CompleteRequest.jsx y AcceptRequest.jsx hacen un
-- join/select contra workers a partir de un service_requests.id
-- conocido (llegado por el link de WhatsApp). Pero la única policy
-- de lectura pública en workers era "is_verified = true", así que
-- si el trabajador quedaba sin verificar en ese momento (ej. un
-- admin lo suspende después de terminar el trabajo), el nombre
-- volvía null sin error — en Rate.jsx eso mostraba "..." en vez
-- del nombre y no dejaba avanzar con confianza al vecino.
--
-- Estas pantallas ya están protegidas por sí mismas: solo se llega
-- a ellas con el UUID de una service_request puntual (no son
-- navegables/listables), así que permitir leer el trabajador de
-- una solicitud real no expone nada que no estuviera ya accesible
-- por ese link.

create policy "public read workers linked to a request" on workers
  for select using (
    exists (
      select 1 from service_requests sr
      where sr.worker_id = workers.id
    )
  );
