import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Collaborator } from '../shared/model/collaborator.module';
import { User } from '../shared/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private db: AngularFirestore ) { }

  addUserData(user: Partial<User>, userId: string | undefined): void {    
    if(userId) {
      this.db.collection('users').doc(userId).set({data: user});   
    } 
  }

  addCollaboratorData(collaborator: Collaborator) : void {
    this.db.collection('employees').doc(collaborator.citizenCard).set({data: collaborator})
  }

  getCollaborators(userUID: string) : AngularFirestoreCollection<Collaborator> {
    return this.db.collection('employees', ref =>
      ref.where("uidSallon", "==", userUID));
  }
}
