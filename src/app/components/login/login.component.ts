import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RecoverPasswordComponent } from '../recover-password/recover-password.component';
import { AuthServiceService } from 'src/app/services/auth-service.service';



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
export class LoginComponent implements OnInit {


  authForm: FormGroup;
  hide: boolean;
  

  constructor(private fb: FormBuilder, public dialog: MatDialog, private authService: AuthServiceService ) {
    this.hide = true;
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required], 
      logged: false});
   }

  ngOnInit(): void {
  }

  logIn(event: Event, value: Auth): void {
    event.stopPropagation();
    this.authService.logInAuth(value.username, value.password);
  }

  recoverPassword(event: Event, email: string) {
    event.stopPropagation();
    this.openDialog(email);
  }

  private openDialog(email:string): void {
    const dialofRef = this.dialog.open(RecoverPasswordComponent, {
      data: email,
    });

    dialofRef.afterClosed().subscribe((email: string) => {
      if(email) {
        this.authService.resetPassword(email);
      }
    })
  }

}
