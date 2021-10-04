import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';

import { RecoverPasswordComponent } from '../recover-password/recover-password.component';

export interface Auth {
  username: string;
  password: string;
  logged: boolean
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  subscription: Subscription;
  authForm: FormGroup;
  hide: boolean;
  
  constructor(private fb: FormBuilder, public dialog: MatDialog, private authService: AuthServiceService, private _snackBar: MatSnackBar) {
    this.hide = true;
    this.subscription = new Subscription();
    
    this.authForm = this.fb.group( {
      username: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required], 
      logged: false });
   }

  logIn(event: Event, value: Auth) : void {
    event.stopPropagation();
    this.subscription.add(
      this.authService.logInAuth(value.username, value.password)
      .subscribe(
      // Success
      () => {}, 
      // Error
      () => {
        this._snackBar.open('Utilizador ou password incorretos', 'Close') })
      );       
  }

  recoverPassword(event: Event, email: string) : void {
    event.stopPropagation();
    this.openDialog(email);
  }

  private openDialog(email:string) : void {
    const dialofRef = this.dialog.open(RecoverPasswordComponent, {data: email});

    this.subscription.add(
      dialofRef.afterClosed()
      .subscribe((email: string) => this.authService.resetPassword(email))
    )
  }

  ngOnDestroy() : void {
    this.subscription.unsubscribe();
  }
}
