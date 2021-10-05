import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

import { AuthServiceService } from '../../services/auth-service.service';
import { FirestoreService } from '../../services/firestore.service';
import { User } from '../../shared/model/user.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  signForm : FormGroup;
  hide : boolean;

  constructor(private fb: FormBuilder, private authService: AuthServiceService, private db: FirestoreService, private loadingService: LoadingService) { 
    this.hide = true;
    this.subscription = new Subscription();
    this.signForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', this.validatePassword()],
      enterprise: ['', Validators.required],
      postalCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      name: ['', Validators.required],
      termsConditions: ['', [Validators.required, Validators.requiredTrue]]
    });
   }

   ngOnInit(): void {
     this.subscription.add(this.signForm.get('password')?.valueChanges.subscribe(() => {
       this.signForm.get('passwordConfirmation')?.updateValueAndValidity();
     }));
   }

   signIn(user: User): void {
     this.loadingService.updateLoading(true);
     this.authService.signUp(user).subscribe(
       //Sucess
       () => {
       this.loadingService.updateLoading(false)
        }, 
      //Error
      () => {
      this.loadingService.updateLoading(false)
     });
   }

   validatePassword(): ValidatorFn {
     return (control: AbstractControl): ValidationErrors | null => 
       control?.parent?.get('password')?.value === control.value ? null : { diffPassword: control.value }
     
   }

   

   showTerms(event: Event) {
   }

   ngOnDestroy(): void {
     this.subscription.unsubscribe();
   }
}
