/*
# Add id_interno UUID and id_invitador UUID to ASOCIADOS

1. Changes to ASOCIADOS table
- Add `id_interno` (uuid, primary key, default gen_random_uuid()) — internal UUID identifier.
- Add `id_invitador` (uuid, nullable) — references ASOCIADOS.id_interno; the person who invited.
- Convert `id_patrocinador` from text (FK to id_empresa) to uuid (FK to id_interno).
- Change primary key from id_empresa to id_interno; add unique constraint on id_empresa.
- Migrate existing data (Elia's row gets an id_interno; her id_patrocinador stays NULL).

2. IMPORTANT NOTES
- id_empresa remains TEXT (unique, not null) — still the business ID (e.g. "10623").
- id_interno is the new UUID primary key.
- id_patrocinador now references id_interno (UUID).
- id_invitador references id_interno (UUID) of the inviter.
- No data is lost.

3. Security
- RLS policies unchanged (already open to anon, authenticated).
*/

-- Step 1: Add id_interno column
ALTER TABLE ASOCIADOS ADD COLUMN IF NOT EXISTS id_interno uuid;

-- Step 2: Generate UUIDs for existing rows
UPDATE ASOCIADOS 
SET id_interno = gen_random_uuid() 
WHERE id_interno IS NULL;

-- Step 3: Make id_interno NOT NULL with default
ALTER TABLE ASOCIADOS ALTER COLUMN id_interno SET NOT NULL;
ALTER TABLE ASOCIADOS ALTER COLUMN id_interno SET DEFAULT gen_random_uuid();

-- Step 4: Drop old PK (cascade drops dependent FK on id_patrocinador too)
ALTER TABLE ASOCIADOS DROP CONSTRAINT IF EXISTS asociados_pkey CASCADE;

-- Step 5: Migrate id_patrocinador from text id_empresa to uuid id_interno
UPDATE ASOCIADOS a
SET id_patrocinador = parent.id_interno::text
FROM ASOCIADOS parent
WHERE a.id_patrocinador IS NOT NULL
  AND a.id_patrocinador = parent.id_empresa;

-- Step 6: Convert id_patrocinador column type to uuid
ALTER TABLE ASOCIADOS ALTER COLUMN id_patrocinador TYPE uuid 
  USING id_patrocinador::uuid;

-- Step 7: Set id_interno as new primary key
ALTER TABLE ASOCIADOS ADD PRIMARY KEY (id_interno);

-- Step 8: Add unique constraint on id_empresa
ALTER TABLE ASOCIADOS ADD CONSTRAINT asociados_id_empresa_unique UNIQUE (id_empresa);

-- Step 9: Add FK for id_patrocinador (uuid -> id_interno)
ALTER TABLE ASOCIADOS 
  ADD CONSTRAINT asociados_id_patrocinador_fkey 
  FOREIGN KEY (id_patrocinador) REFERENCES ASOCIADOS(id_interno) ON DELETE SET NULL;

-- Step 10: Add id_invitador column
ALTER TABLE ASOCIADOS ADD COLUMN IF NOT EXISTS id_invitador uuid;

-- Step 11: Add FK for id_invitador (uuid -> id_interno)
ALTER TABLE ASOCIADOS 
  ADD CONSTRAINT asociados_id_invitador_fkey 
  FOREIGN KEY (id_invitador) REFERENCES ASOCIADOS(id_interno) ON DELETE SET NULL;

-- Step 12: Indexes
CREATE INDEX IF NOT EXISTS idx_asociados_invitador ON ASOCIADOS(id_invitador);
CREATE INDEX IF NOT EXISTS idx_asociados_patrocinador_uuid ON ASOCIADOS(id_patrocinador);
