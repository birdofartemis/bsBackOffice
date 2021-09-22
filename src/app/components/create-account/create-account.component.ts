import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {

  email: FormControl;
  password: FormControl;

  constructor(public dialofRef: MatDialogRef<CreateAccountComponent>, @Inject(MAT_DIALOG_DATA) public userData?: {email: string, password: string}) { 
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
   }

  onCancel(): void {
    this.dialofRef.close();
  }

}
