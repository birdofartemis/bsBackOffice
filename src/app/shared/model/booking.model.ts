export interface Booking {
  documentId: string;
  client: string;
  date: Date;
  hour?: string;
  service: string; //id
  //citizenCard
  collaborator: number; //id
  uidSallon: string;
}
