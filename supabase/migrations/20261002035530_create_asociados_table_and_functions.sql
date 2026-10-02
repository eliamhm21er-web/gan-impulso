/*
# Create ASOCIADOS table and RPC functions for GAN.Impulso

1. New Tables
- `ASOCIADOS`: stores network associates/members.
  - `id_empresa` (text, primary key) — the associate's business ID (e.g. "10623")
  - `nombre` (text, not null) — full name of the associate
  - `estado` (text, not null, default 'activo') — status: 'activo' or 'inactivo'
  - `id_patrocinador` (text, nullable) — foreign key to ASOCIADOS.id_empresa, the sponsor/upline
  - `nivel` (int, not null, default 0) — depth level in the tree (root = 0)
  - `posicion` (int, not null, default 0) — position among siblings (1-4)
  - `created_at` (timestamptz, default now())

2. RPC Functions
- `buscar_invitador(p_id_empresa text)` — looks up an associate by id_empresa, returns id_empresa, nombre, estado.
- `calcular_patrocinador(p_id_invitador text)` — finds the next available sponsor slot (max 4 direct children) using a BFS from the inviter. Returns id_patrocinador, nivel, posicion.

3. Security
- RLS enabled on ASOCIADOS.
- Full CRUD for anon + authenticated (no-auth app, data is intentionally public/shared).

4. Initial Data
- Insert root associate: id_empresa = '10623', nombre = 'Elia', estado = 'activo', nivel = 0.

5. Structure: 4x∞
- Each associate can have at most 4 direct children.
- Levels are unlimited (infinite depth).
- New associates are placed under the first available sponsor with < 4 children, using BFS from the inviter.
*/

-- ============================================================
-- TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS ASOCIADOS (
  id_empresa      text PRIMARY KEY,
  nombre          text NOT NULL,
  estado          text NOT NULL DEFAULT 'activo',
  id_patrocinador text REFERENCES ASOCIADOS(id_empresa) ON DELETE SET NULL,
  nivel           int  NOT NULL DEFAULT 0,
  posicion        int  NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_asociados_patrocinador ON ASOCIADOS(id_patrocinador);
CREATE INDEX IF NOT EXISTS idx_asociados_estado ON ASOCIADOS(estado);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE ASOCIADOS ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_asociados" ON ASOCIADOS;
CREATE POLICY "anon_select_asociados" ON ASOCIADOS FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_asociados" ON ASOCIADOS;
CREATE POLICY "anon_insert_asociados" ON ASOCIADOS FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_asociados" ON ASOCIADOS;
CREATE POLICY "anon_update_asociados" ON ASOCIADOS FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_asociados" ON ASOCIADOS;
CREATE POLICY "anon_delete_asociados" ON ASOCIADOS FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- RPC: buscar_invitador
-- ============================================================
CREATE OR REPLACE FUNCTION buscar_invitador(p_id_empresa text)
RETURNS TABLE (id_empresa text, nombre text, estado text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT a.id_empresa, a.nombre, a.estado
    FROM ASOCIADOS a
    WHERE a.id_empresa = p_id_empresa
      AND a.estado = 'activo'
    LIMIT 1;
END;
$$;

-- ============================================================
-- RPC: calcular_patrocinador
-- BFS from inviter to find first associate with < 4 direct children.
-- Returns that associate's id as the sponsor, along with nivel and next posicion.
-- ============================================================
CREATE OR REPLACE FUNCTION calcular_patrocinador(p_id_invitador text)
RETURNS TABLE (id_patrocinador text, nivel int, posicion int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current    text;
  v_nivel      int;
  v_child_count int;
  v_next_pos   int;
  v_queue      text[] := ARRAY[]::text[];
  v_head_idx   int := 1;
  v_child_row  record;
BEGIN
  -- Verify the inviter exists and is active
  PERFORM 1 FROM ASOCIADOS WHERE id_empresa = p_id_invitador AND estado = 'activo' LIMIT 1;
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
    WHERE id_patrocinador = v_current;

    IF v_child_count < 4 THEN
      -- This candidate has room; find the next position and nivel
      v_next_pos := v_child_count + 1;
      SELECT nivel INTO v_nivel FROM ASOCIADOS WHERE id_empresa = v_current LIMIT 1;
      RETURN QUERY SELECT v_current, v_nivel, v_next_pos;
      RETURN;
    END IF;

    -- No room here; enqueue this candidate's children (BFS order)
    FOR v_child_row IN
      SELECT id_empresa FROM ASOCIADOS
      WHERE id_patrocinador = v_current
      ORDER BY posicion
    LOOP
      v_queue := array_append(v_queue, v_child_row.id_empresa);
    END LOOP;
  END LOOP;

  -- Fallback (shouldn't happen in 4x∞, but safety net)
  RETURN QUERY SELECT p_id_invitador, 0, 1;
END;
$$;

-- ============================================================
-- INITIAL DATA: root associate Elia (ID 10623)
-- ============================================================
INSERT INTO ASOCIADOS (id_empresa, nombre, estado, id_patrocinador, nivel, posicion)
VALUES ('10623', 'Elia', 'activo', NULL, 0, 0)
ON CONFLICT (id_empresa) DO NOTHING;
