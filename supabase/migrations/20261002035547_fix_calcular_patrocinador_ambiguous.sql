/*
# Fix ambiguous column reference in calcular_patrocinador

The PL/pgSQL variable `id_patrocinador` in the return clause collided with the
table column of the same name in WHERE clauses. Prefixed all column references
with the table alias `ASOCIADOS.` to remove the ambiguity.
*/

CREATE OR REPLACE FUNCTION calcular_patrocinador(p_id_invitador text)
RETURNS TABLE (id_patrocinador text, nivel int, posicion int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current     text;
  v_nivel       int;
  v_child_count int;
  v_next_pos    int;
  v_queue       text[] := ARRAY[]::text[];
  v_head_idx    int := 1;
  v_child_row   record;
BEGIN
  -- Verify the inviter exists and is active
  PERFORM 1 FROM ASOCIADOS WHERE ASOCIADOS.id_empresa = p_id_invitador AND ASOCIADOS.estado = 'activo' LIMIT 1;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Initialize BFS queue with the inviter
  v_queue := array_append(v_queue, p_id_invitador);

  WHILE v_head_idx <= array_length(v_queue, 1) LOOP
    v_current := v_queue[v_head_idx];
    v_head_idx := v_head_idx + 1;

    -- Count direct children of this candidate
    SELECT count(*) INTO v_child_count
    FROM ASOCIADOS
    WHERE ASOCIADOS.id_patrocinador = v_current;

    IF v_child_count < 4 THEN
      -- This candidate has room; find the next position and nivel
      v_next_pos := v_child_count + 1;
      SELECT ASOCIADOS.nivel INTO v_nivel FROM ASOCIADOS WHERE ASOCIADOS.id_empresa = v_current LIMIT 1;
      RETURN QUERY SELECT v_current, v_nivel, v_next_pos;
      RETURN;
    END IF;

    -- No room here; enqueue this candidate's children (BFS order)
    FOR v_child_row IN
      SELECT ASOCIADOS.id_empresa FROM ASOCIADOS
      WHERE ASOCIADOS.id_patrocinador = v_current
      ORDER BY ASOCIADOS.posicion
    LOOP
      v_queue := array_append(v_queue, v_child_row.id_empresa);
    END LOOP;
  END LOOP;

  -- Fallback (shouldn't happen in 4x∞, but safety net)
  RETURN QUERY SELECT p_id_invitador, 0, 1;
END;
$$;
