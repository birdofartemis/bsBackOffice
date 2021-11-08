import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  addCollaboratorData(collaborator: Collaborator): void {
    this.db.collection('employees').doc(collaborator.citizenCard).set({...collaborator})
  }

  deleteCollaboratorData(collaborator: Collaborator): void {
    this.db.collection('employees').doc(collaborator.citizenCard).delete();
  }

  getCollaborators(userUID: string): Observable<Collaborator[]> {
    const ref = this.db.collection('employees').ref as CollectionReference<Collaborator>;
    return from(ref.where("uidSallon", "==", userUID).get()).pipe(map((res) => res.docs.map((value) => value.data())));
  }
}
