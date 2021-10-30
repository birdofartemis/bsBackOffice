import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../shared/model/user.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private auth: AngularFireAuth, private resourceService: FirestoreService) { }


  logInAuth(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.auth.signInWithEmailAndPassword(email, password))
  }
  
  resetPassword(email: string) : void {
    this.auth.useDeviceLanguage();

    this.auth.sendPasswordResetEmail(email).then( () => console.log('Email sent with sucess')).catch(error => console.error(error));
  }

  isEmailAccount(email: string) : void { //same doubts
    this.auth.user.subscribe((user => {
      return user?.email == email;
    }))
  }

  signUp({ password, passwordConfirmation, termsConditions, ...others}: User) : Observable<firebase.auth.UserCredential>{
   return from(this.auth.createUserWithEmailAndPassword(others.email, password))
   .pipe(tap(({ user }) => this.resourceService.addUserData(others, user?.uid)));
  }

  getUserUID() {
     return this.auth.authState;
  }
}
