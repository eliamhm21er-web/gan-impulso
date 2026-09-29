export type RegistrationStatus = 'pending' | 'active';

export interface AssociateInfo {
  id: string;
  name: string;
  status: RegistrationStatus;
}

export interface SponsorAssignment {
  sponsorId: string;
  sponsorName: string;
}

export type RegistrationStep = 'inviter' | 'ganamex' | 'success';
