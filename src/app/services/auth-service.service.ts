import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../shared/model/user.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(
    private auth: AngularFireAuth,
    private resourceService: FirestoreService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

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

  updateUserEmail(onChangeUser: { email: string; newEmail: string; password: string }) {
    return this.logInAuth(onChangeUser.email, onChangeUser.password).subscribe((res) => {
      res.user?.updateEmail(onChangeUser.newEmail).then(
        () => {
          this._snackBar.open('Alteração executada com sucesso', 'Fechar');
          this.logOutUser().subscribe();
          this.router.navigate([''], { relativeTo: this.route });
        },

        () => {
          this._snackBar.open('Não foi possível executar a alteração', 'Fechar');
        }
      );
    });
  }

  getUserUID(): Observable<firebase.User | null> {
    return this.auth.authState;
  }

  logOutUser(): Observable<void> {
    return from(this.auth.signOut());
  }
}
