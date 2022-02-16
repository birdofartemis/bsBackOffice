import { Collaborator } from './collaborator.model';

export interface Service {
  documentId: string;
  url?: string;
  name: string;
  price: number;
  description: string;
  collaboratorIdList: string[];
  uidSalon: string;
}

export interface ServiceForm extends Omit<Service, 'collaboratorIdList'> {
  collaboratorIdList: Collaborator[];
}

export type ServiceDoc = firebase.default.firestore.DocumentSnapshot<Service>;
