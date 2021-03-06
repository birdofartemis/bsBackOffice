import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  email: FormControl;

  constructor(public dialofRef: MatDialogRef<RecoverPasswordComponent>, @Inject(MAT_DIALOG_DATA) public userData?: string) {
    this.email = new FormControl('', [Validators.required, Validators.email]);
  }

  //Set form to have the email that is being writen on the login page
  ngOnInit(): void {
    if (this.userData) {
      this.email.setValue(this.userData);
    }
  }
}
