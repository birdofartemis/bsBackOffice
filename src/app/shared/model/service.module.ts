import { Collaborator } from './collaborator.module';

export interface Service {
    idDocument: string;
    url?: string;
    name: string;
    price: number;
    description: string;
    collaborator: string[];
    uidSallon: string;
}

export interface ServiceForm extends Omit<Service, 'collaborator'> {
    collaborator: Collaborator[]
}

export type ServiceDoc = firebase.default.firestore.DocumentSnapshot<Service>;