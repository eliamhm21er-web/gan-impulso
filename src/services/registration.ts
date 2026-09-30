import { supabase } from '@/lib/supabase';
import type { AssociateInfo, SponsorAssignment } from '@/types';

interface InviterRow {
  id_empresa: string;
  nombre: string;
  estado: string | null;
}

interface SponsorRow {
  id_patrocinador: string;
  nivel: number;
  posicion: number;
}

export async function lookupInviter(
  inviterId: string
): Promise<AssociateInfo | null> {
  const normalized = inviterId.trim();
  if (normalized.length < 3) return null;

  const { data, error } = await supabase.rpc('buscar_invitador', {
    p_id_empresa: normalized,
  });

  if (error) {
    console.error('Error al buscar invitador:', error.message);
    return null;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) return null;

  const row = (Array.isArray(data) ? data[0] : data) as InviterRow;
  if (!row?.id_empresa || !row?.nombre) return null;

  return {
    id: row.id_empresa,
    name: row.nombre,
    status: row.estado === 'activo' ? 'active' : 'pending',
  };
}

export async function calculateSponsor(
  inviterId: string
): Promise<SponsorAssignment | null> {
  const normalized = inviterId.trim();
  if (normalized.length < 3) return null;

  const { data, error } = await supabase.rpc('calcular_patrocinador', {
    p_id_invitador: normalized,
  });

  if (error) {
    console.error('Error al calcular patrocinador:', error.message);
    return null;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) return null;

  const result = (Array.isArray(data) ? data[0] : data) as SponsorRow;
  if (!result?.id_patrocinador) return null;

  return {
    sponsorId: result.id_patrocinador,
    sponsorName: '',
  };
}

/**
 * En esta etapa el ID de GANAMEX lo proporciona el propio asociado
 * después de completar su registro externo. No se valida consultando
 * ASOCIADOS porque el registro todavía no existe como asociado activo.
 */
export async function validateAssociateId(
  associateId: string
): Promise<boolean> {
  return associateId.trim().length >= 3;
}

export type RegistrationStatus = 'pending' | 'active';
