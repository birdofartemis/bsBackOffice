import { Timestamp } from '@angular/fire/firestore';

export interface Booking {
  documentId: string;
  client: string;
  date: Timestamp | Date;
  hour?: string;
  serviceId: string; //id
  //citizenCard
  collaboratorId: number; //id
  uidSalon: string;
}
