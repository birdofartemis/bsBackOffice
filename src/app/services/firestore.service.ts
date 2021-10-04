import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { User } from '../shared/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public db: AngularFirestore) { }

  addUserData(user: Partial<User>, userId: string | undefined): void {
    console.log(userId);
    
    if(userId) {
      this.db.collection('users').doc(userId).set({data: user});   
    } 
  }
}
