import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentReference } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Collaborator } from '../shared/model/collaborator.model';
import { Service, ServiceDoc } from '../shared/model/service.model';
import { User } from '../shared/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private db: AngularFirestore) {}
  //User
  addUserData(user: Partial<User>, userId: string | undefined): void {
    if (userId) {
      this.db.collection('users').doc(userId).set({ data: user });
    }
  }
  //Collaborators
  addCollaboratorData(collaborator: Collaborator): void {
    this.db
      .collection('employees')
      .doc(collaborator.citizenCard)
      .set({ ...collaborator });
  }

  deleteCollaboratorData(collaborator: Collaborator): void {
    this.db.collection('employees').doc(collaborator.citizenCard).delete();
  }

  getCollaborators(userUID: string): Observable<Collaborator[]> {
    const ref = this.db.collection('employees').ref as CollectionReference<Collaborator>;
    return from(ref.where('uidSallon', '==', userUID).get()).pipe(map((res) => res.docs.map((value) => value.data())));
  }

  getCollaborator(citizenCard: string) {
    return this.db.collection('employees').doc<Collaborator>(citizenCard).get();
  }

  updateCollaborator(collaborator: Collaborator): void {
    const { citizenCard } = collaborator;
    this.db.collection('employees').doc<Collaborator>(citizenCard).update(collaborator);
  }
  //Services
  addServiceData(service: Service): Observable<DocumentReference<unknown>> {
    return from(this.db.collection('services').add({ ...service }));
  }

  deleteServiceData(idDocument: string): void {
    this.db.collection('services').doc(idDocument).delete();
  }

  updateServiceData(service: Service): void {
    this.db.collection('services').doc(service.idDocument).update(service);
  }

  getServices(userUID: string): Observable<Service[]> {
    const ref = this.db.collection('services').ref as CollectionReference<Service>;
    return from(ref.where('uidSallon', '==', userUID).get()).pipe(map((res) => res.docs.map((value) => value.data())));
  }
  getService(idDocument: string): Observable<ServiceDoc> {
    return this.db.collection('services').doc<Service>(idDocument).get();
  }

  getCollaboratorsFromService(citizenCards: string[]): Observable<Collaborator[]> {
    const ref = this.db.collection('employees').ref as CollectionReference<Collaborator>;
    return from(ref.where('citizenCard', 'in', citizenCards).get()).pipe(map((res) => res.docs.map((value) => value.data())));
  }
}
