import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {

  signForm : FormGroup;
  hide : boolean;

  constructor(private fb: FormBuilder, private authService: AuthServiceService) { 
    this.hide = true;
    this.signForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
      enterprise: ['', Validators.required],
      postalCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      name: ['', Validators.required]
    });
   }

   signIn(email: string, password: string){
     this.authService.signUp(email, password);
   }
}
