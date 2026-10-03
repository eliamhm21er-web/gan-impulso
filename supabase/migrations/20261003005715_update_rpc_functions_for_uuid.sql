/*
# Update RPC functions for UUID-based schema

1. Changes
- `buscar_invitador`: now returns id_interno (uuid) alongside id_empresa, nombre, estado.
- `calcular_patrocinador`: rewritten to work with UUID id_interno. Returns id_interno (uuid), nivel, posicion.

2. Notes
- Both functions are SECURITY DEFINER with explicit search_path = public.
- No changes to table structure or RLS.
*/

DROP FUNCTION IF EXISTS buscar_invitador(text);
DROP FUNCTION IF EXISTS calcular_patrocinador(text);

CREATE FUNCTION buscar_invitador(p_id_empresa text)
RETURNS TABLE (id_interno uuid, id_empresa text, nombre text, estado text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT a.id_interno, a.id_empresa, a.nombre, a.estado
    FROM ASOCIADOS a
    WHERE a.id_empresa = p_id_empresa
      AND a.estado = 'activo'
    LIMIT 1;
END;
$$;

CREATE FUNCTION calcular_patrocinador(p_id_invitador text)
RETURNS TABLE (id_interno uuid, nivel int, posicion int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current       uuid;
  v_nivel         int;
  v_child_count   int;
  v_next_pos      int;
  v_queue         uuid[] := ARRAY[]::uuid[];
  v_head_idx      int := 1;
  v_child_row     record;
  v_inviter_interno uuid;
BEGIN
  SELECT a.id_interno INTO v_inviter_interno
  FROM ASOCIADOS a
  WHERE a.id_empresa = p_id_invitador AND a.estado = 'activo'
  LIMIT 1;
  IF v_inviter_interno IS NULL THEN
    RETURN;
  END IF;

  v_queue := array_append(v_queue, v_inviter_interno);

  WHILE v_head_idx <= array_length(v_queue, 1) LOOP
    v_current := v_queue[v_head_idx];
    v_head_idx := v_head_idx + 1;

    SELECT count(*) INTO v_child_count
    FROM ASOCIADOS
    WHERE ASOCIADOS.id_patrocinador = v_current;

    IF v_child_count < 4 THEN
      v_next_pos := v_child_count + 1;
      SELECT ASOCIADOS.nivel INTO v_nivel FROM ASOCIADOS WHERE ASOCIADOS.id_interno = v_current LIMIT 1;
      RETURN QUERY SELECT v_current, v_nivel, v_next_pos;
      RETURN;
    END IF;

    FOR v_child_row IN
      SELECT ASOCIADOS.id_interno FROM ASOCIADOS
      WHERE ASOCIADOS.id_patrocinador = v_current
      ORDER BY ASOCIADOS.posicion
    LOOP
      v_queue := array_append(v_queue, v_child_row.id_interno);
    END LOOP;
  END LOOP;

  RETURN QUERY SELECT v_inviter_interno, 0, 1;
END;
$$;
