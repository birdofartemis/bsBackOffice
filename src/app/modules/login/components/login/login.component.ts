import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

import { RecoverPasswordComponent } from '../recover-password/recover-password.component';

export interface Auth {
  email: string;
  password: string;
  logged: boolean;
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

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthServiceService,
    private _snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.hide = true;
    this.subscription = new Subscription();

    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      logged: false
    });
  }

  //Login user and redirects to home page
  logIn(event: Event, value: Auth): void {
    event.stopPropagation();
    this.loadingService.updateLoading(true);

    this.subscription.add(
      this.authService.logInAuth(value.email, value.password).subscribe(
        // Success
        () => {
          this.loadingService.updateLoading(false);
          this.router.navigate(['home'], { relativeTo: this.route });
        },
        // Error
        () => {
          this.loadingService.updateLoading(false);
          this._snackBar.open('Utilizador ou password incorretos', 'Fechar');
        }
      )
    );
  }
  //Opens dialog to send email to user'email to change password
  recoverPassword(event: Event, email: string): void {
    event.stopPropagation();
    this.openDialog(email);
  }

  //Opens dialog
  private openDialog(email: string): void {
    const dialofRef = this.dialog.open(RecoverPasswordComponent, { data: email });

    this.subscription.add(dialofRef.afterClosed().subscribe((email: string) => this.authService.resetPassword(email)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
