import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentReference } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Booking } from '../shared/model/booking.model';
import { Collaborator } from '../shared/model/collaborator.model';
import { Service, ServiceDoc } from '../shared/model/service.model';
import { User, UserDoc } from '../shared/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private db: AngularFirestore) {}
  //User
  addUserData(user: Partial<User>, userId: string | undefined): void {
    if (userId) {
      this.db.collection('users').doc(userId).set(user);
    }
  }

  getUserData(idDocument: string): Observable<UserDoc> {
    return this.db.collection('users').doc<User>(idDocument).get();
  }

  updateUserData(user: Partial<User>, userId: string) {
    if (userId) {
      const { termsConditions, passwordConfirmation, password, ...userData } = user;
      this.db.collection('users').doc<User>(userId).update(userData);
    }
  }

  //Collaborators
  addCollaboratorData(collaborator: Collaborator): void {
    this.db
      .collection('employees')
      .doc(collaborator.citizenCard)
      .set({ ...collaborator });
  }

  triggerDeleteCollaboratorData(collaborator: Collaborator, userUID: string) {
    return this.getServices(userUID).pipe(
      map((services) => services.map((service) => service.collaboratorIdList.find((id) => id === collaborator.citizenCard)))
    );
  }

  deleteCollaboratorData(collaborator: Collaborator): void {
    this.db.collection('employees').doc(collaborator.citizenCard).delete();
  }

  getCollaborators(userUID: string): Observable<Collaborator[]> {
    const ref = this.db.collection('employees').ref as CollectionReference<Collaborator>;
    return from(ref.where('uidSalon', '==', userUID).get()).pipe(map((res) => res.docs.map((value) => value.data())));
  }

  getAvailableCollaborators(userUID: string) {
    const ref = this.db.collection('employees').ref as CollectionReference<Collaborator>;
    return from(ref.where('uidSalon', '==', userUID).where('status', '==', 'Disponível').get()).pipe(
      map((res) => res.docs.map((value) => value.data()))
    );
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

  triggerDeleteServiceData(service: Service, userUID: string) {
    return this.getBookings(userUID).pipe(map((bookings) => bookings.find((booking) => booking.serviceId === service.documentId)));
  }

  deleteServiceData(documentId: string): void {
    this.db.collection('services').doc(documentId).delete();
  }

  updateServiceData(service: Service): void {
    this.db.collection('services').doc(service.documentId).update(service);
  }

  getServices(userUID: string): Observable<Service[]> {
    const ref = this.db.collection('services').ref as CollectionReference<Service>;
    return from(ref.where('uidSalon', '==', userUID).get()).pipe(map((res) => res.docs.map((value) => value.data())));
  }
  getService(idDocument: string): Observable<ServiceDoc> {
    return this.db.collection('services').doc<Service>(idDocument).get();
  }

  getCollaboratorsFromService(citizenCards: string[]): Observable<Collaborator[]> {
    const ref = this.db.collection('employees').ref as CollectionReference<Collaborator>;
    return from(ref.where('citizenCard', 'in', citizenCards).get()).pipe(map((res) => res.docs.map((value) => value.data())));
  }

  getAvailableCollaboratorsFromService(citizenCards: string[]): Observable<Collaborator[]> {
    const ref = this.db.collection('employees').ref as CollectionReference<Collaborator>;
    return from(ref.where('citizenCard', 'in', citizenCards).where('status', '==', 'Disponível').get()).pipe(
      map((res) => res.docs.map((value) => value.data()))
    );
  }

  //Bookings

  addBookingData(booking: Booking): Observable<DocumentReference<unknown>> {
    return from(this.db.collection('bookings').add({ ...booking }));
  }

  deleteBookingData({ documentId }: Booking): void {
    this.db.collection('bookings').doc(documentId).delete();
  }

  getBookings(userUID: string): Observable<Booking[]> {
    const ref = this.db.collection('bookings').ref as CollectionReference<Booking>;
    return from(ref.orderBy('date').where('uidSalon', '==', userUID).get()).pipe(map((res) => res.docs.map((value) => value.data())));
  }

  getBooking({ documentId }: Booking) {
    return this.db.collection('bookings').doc<Booking>(documentId).get();
  }

  updateBookingData(booking: Booking): void {
    this.db.collection('bookings').doc(booking.documentId).update(booking);
  }
}
