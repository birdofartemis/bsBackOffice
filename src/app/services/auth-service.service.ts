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
  constructor(private auth: AngularFireAuth, private resourceService: FirestoreService) {}

  logInAuth(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.auth.signInWithEmailAndPassword(email, password));
  }

  resetPassword(email: string): void {
    this.auth.useDeviceLanguage();

    this.auth
      .sendPasswordResetEmail(email)
      .then(() => console.log('Email sent with sucess'))
      .catch((error) => console.error(error));
  }

  signUp({ password, passwordConfirmation, termsConditions, ...others }: User): Observable<firebase.auth.UserCredential> {
    return from(this.auth.createUserWithEmailAndPassword(others.email, password)).pipe(
      tap(({ user }) => this.resourceService.addUserData(others, user?.uid))
    );
  }

  updateEmail(fn: (_: string) => Promise<void>, newEmail: string): Observable<void> {
    return from(fn(newEmail));
  }

  updateUserEmail(_user: { email: string; newEmail: string; password: string }) {
    return this.logInAuth(_user.email, _user.password).pipe(
      tap(({ user }) => {
        if (user) {
          this.updateEmail(user.updateEmail, _user.newEmail);
        }
      })
    );
  }

  getUserUID(): Observable<firebase.User | null> {
    return this.auth.authState;
  }

  logOutUser(): Observable<void> {
    return from(this.auth.signOut());
  }
}
