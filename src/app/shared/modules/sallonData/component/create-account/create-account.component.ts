import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { FirestoreService, StorageService } from 'src/app/services';
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

  @ViewChild('photoInput') photoInput!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private fs: FirestoreService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private _snackBar: MatSnackBar,
    private storage: StorageService
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
      termsConditions: ['', [Validators.required, Validators.requiredTrue]],
      url: ['']
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

  onCancelButton(event: Event) {
    event.stopPropagation();
    if (!this.isEdit && this.signForm.get('url')!.value) {
      this.storage.deletePhoto(this.signForm.get('url')!.value);
      this.router.navigate(['/signin'], { relativeTo: this.route });
    } else {
      this.router.navigate(['/home/config'], { relativeTo: this.route });
    }
  }

  //Stores image
  changeImage(event: MouseEvent): void {
    event.stopPropagation();
    if (event.isTrusted) {
      this.photoInput.nativeElement.click();
    }
  }

  photoInputChange(event: any): void {
    if (event && this.signForm.get('url')!.value) {
      this.storage.deletePhoto(this.signForm.get('url')!.value);
      this.storage.uploadFile(event, UUID.UUID()).subscribe((res) => {
        this.signForm.get('url')?.setValue(`gs://${res.ref.bucket}/${res.ref.fullPath}`);
      });
    } else {
      this.storage.uploadFile(event, UUID.UUID()).subscribe((res) => {
        this.signForm.get('url')?.setValue(`gs://${res.ref.bucket}/${res.ref.fullPath}`);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
