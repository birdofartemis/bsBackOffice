export interface Booking {
  documentId: string;
  client: string;
  date: Date;
  hour?: string;
  serviceId: string; //id
  //citizenCard
  collaboratorId: number; //id
  uidSalon: string;
}
