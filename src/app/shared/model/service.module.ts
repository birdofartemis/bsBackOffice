import { Collaborator } from './collaborator.module';

export interface Service {
    uid:string;
    name: string;
    price: number;
    collaborator: string[];
    uidSallon: string;
}

export interface ServiceForm extends Omit<Service, 'collaborator'> {
    collaborator: Collaborator[]

}