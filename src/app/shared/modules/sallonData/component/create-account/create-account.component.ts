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
      enterpriseName: ['', Validators.required],
      postalCode: ['', Validators.required],
      telephone: ['', Validators.required],
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
            //if the url contains the id of salon it will patch the form
            const values = user.data();
            this.signForm.patchValue(values || {});

            this.isEdit = true;

            //Clear validation to email and password if is an edit
            this.clearValidators(this.signForm.get('email'));
            this.clearValidators(this.signForm.get('password'));
            this.clearValidators(this.signForm.get('passwordConfirmation'));
          })
        )
        .subscribe()
    );
    //If doesn't carries id salon on url
    this.subscription.add(
      //Listenner on password
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
  //Create account
  signIn(user: User): void {
    this.loadingService.updateLoading(true);
    this.authService.signUp(user).subscribe(
      //Sucess
      () => {
        //Redirects to home page
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

  //Update data user on firestore
  editUserData(user: User): void {
    this.loadingService.updateLoading(true);

    this.authService.getUserUID().subscribe((userLogged) => {
      if (userLogged?.uid) {
        //Update user data and redirects to home page
        this.fs.updateUserData(user, userLogged!.uid);
        this._snackBar.open('Alterações executadas com sucesso', 'Fechar');
        this.router.navigate(['/home'], { relativeTo: this.route });
      } else {
        //Redirects to login Page
        this._snackBar.open('Conta não reconhecida', 'Fechar');
        this.router.navigate(['/'], { relativeTo: this.route });
      }
    });
    this.loadingService.updateLoading(false);
  }

  //Function that will return an error or null
  validatePassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      //Condition of the custom Validador
      control?.parent?.get('password')?.value === control.value ? null : { diffPassword: control.value };
  }

  showTerms(event: Event) {}

  imageChanged(imageInput: { files: File[] }): void {
    const file = imageInput.files[0];

    if (!file) return;

    const mimeType = file.type;
    const reg = /image\/*/;
    if (reg.exec(mimeType) == null) {
      this._snackBar.open('Apenas imagens são suportadas');
      return;
    }
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      /* if (editingSelf) this.store.dispatch(setUserPhoto({ photo: reader.result as string }));
      return this.store.dispatch(addResourcePhoto({ photo: reader.result, file })); */
    };

    // if (this.resourceForm.get('_id').value) this.store.dispatch(updatePicture({ id: this.resourceForm.get('_id').value as string, file }));
  }

  changeImage(): void {
    document!.getElementById('image')!.click();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
