import { supabase } from '@/lib/supabase';
import type { AssociateInfo, SponsorAssignment } from '@/types';

interface InviterRow {
  id_interno: string;
  id_empresa: string;
  nombre: string;
  estado: string | null;
}

interface SponsorRow {
  id_interno: string;
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
    internalId: row.id_interno,
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
  if (!result?.id_interno) return null;

  const { data: sponsorData } = await supabase
    .from('asociados')
    .select('id_empresa, nombre')
    .eq('id_interno', result.id_interno)
    .maybeSingle();

  return {
    sponsorInternalId: result.id_interno,
    sponsorId: sponsorData?.id_empresa ?? '',
    sponsorName: sponsorData?.nombre ?? '',
    nivel: result.nivel,
    posicion: result.posicion,
  };
}

export async function validateAssociateId(
  associateId: string
): Promise<boolean> {
  const normalized = associateId.trim();
  if (normalized.length < 3) return false;

  const { data, error } = await supabase
    .from('asociados')
    .select('id_empresa')
    .eq('id_empresa', normalized)
    .maybeSingle();

  if (error) {
    console.error('Error al validar ID de asociado:', error.message);
    return true;
  }

  return data === null;
}

export interface SaveAssociateParams {
  associateId: string;
  name: string;
  inviterInternalId: string;
  sponsorInternalId: string;
  nivel: number;
  posicion: number;
}

export async function saveAssociate(
  params: SaveAssociateParams
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase
    .from('asociados')
    .insert({
      id_empresa: params.associateId.trim(),
      nombre: params.name.trim(),
      id_invitador: params.inviterInternalId,
      id_patrocinador: params.sponsorInternalId,
      estado: 'activo',
      nivel: params.nivel,
      posicion: params.posicion,
    });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Ya existe un asociado con ese ID' };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export type RegistrationStatus = 'pending' | 'active';
