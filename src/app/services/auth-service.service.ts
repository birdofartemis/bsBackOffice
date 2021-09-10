import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'



@Injectable({
  providedIn: 'root'
  
})
export class AuthServiceService {

  constructor(public auth: AngularFireAuth) { }


  logInAuth(email: string, password: string ){
    this.auth.signInWithEmailAndPassword(email, password).then(res => console.log(res));
    
  }
}
