export type RegistrationStatus = 'pending' | 'active';

export interface AssociateInfo {
  id: string;
  internalId: string;
  name: string;
  status: RegistrationStatus;
}

export interface SponsorAssignment {
  sponsorInternalId: string;
  sponsorId: string;
  sponsorName: string;
  nivel: number;
  posicion: number;
}

export type RegistrationStep = 'inviter' | 'ganamex' | 'success';
