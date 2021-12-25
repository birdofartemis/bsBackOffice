import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

import { AuthServiceService } from '../../../../../services/auth-service.service';
import { User, UserDoc } from '../../../../model/user.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  signForm: FormGroup;
  hide: boolean;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private fs: FirestoreService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private _snackBar: MatSnackBar
  ) {
    this.hide = true;
    this.isEdit = false;
    this.subscription = new Subscription();

    this.signForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required, this.validatePassword()]],
      enterprise: ['', Validators.required],
      postalCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      name: ['', Validators.required],
      termsConditions: ['', [Validators.required, Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params
        .pipe(
          filter(({ id }) => !!id),
          switchMap(({ id }) => this.fs.getUserData(id)),
          tap((user: UserDoc) => {
            const values = user.data();
            this.signForm.patchValue(values || {});

            this.isEdit = true;

            this.clearValidators(this.signForm.get('email'));
            this.clearValidators(this.signForm.get('password'));
            this.clearValidators(this.signForm.get('passwordConfirmation'));
          })
        )
        .subscribe()
    );
    this.subscription.add(
      this.signForm.get('password')?.valueChanges.subscribe(() => {
        this.signForm.get('passwordConfirmation')?.updateValueAndValidity();
      })
    );
  }

  clearValidators(control: AbstractControl | null): void {
    control?.clearAsyncValidators();
    control?.clearValidators();
    control?.updateValueAndValidity();
  }

  signIn(user: User): void {
    this.loadingService.updateLoading(true);
    this.authService.signUp(user).subscribe(
      //Sucess
      () => {
        this.router.navigate(['home'], { relativeTo: this.route });
        this.loadingService.updateLoading(false);
      },
      //Error
      () => {
        this.loadingService.updateLoading(false);
        this._snackBar.open('Email incorreto ou já usado anteriormente', 'Fechar');
      }
    );
  }

  editUserData(user: User): void {
    this.loadingService.updateLoading(true);
    this.authService.getUserUID().subscribe((userLogged) => {
      if (userLogged?.uid) {
        this.fs.updateUserData(user, userLogged!.uid);
        this._snackBar.open('Alterações executadas com sucesso', 'Fechar');
        this.router.navigate(['/home'], { relativeTo: this.route });
      } else {
        this._snackBar.open('Conta não reconhecida', 'Fechar');
        this.router.navigate(['/'], { relativeTo: this.route });
      }
    });
    this.loadingService.updateLoading(false);
  }

  validatePassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      control?.parent?.get('password')?.value === control.value ? null : { diffPassword: control.value };
  }

  showTerms(event: Event) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
