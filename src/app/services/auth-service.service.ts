import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Injectable({
  providedIn: 'root'
  
})
export class AuthServiceService {

  constructor(public auth: AngularFireAuth) { }


  logInAuth(email: string, password: string ) {
    this.auth.signInWithEmailAndPassword(email, password).then(res => console.log(res));
    
  }

  resetPassword(email: string) {
    this.auth.useDeviceLanguage();

    this.auth.sendPasswordResetEmail(email).then( () => console.log('Email sent with sucess')).catch(error => console.error(error));
  }

  signUp(email:string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password);
  }
}
