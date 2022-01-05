import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from 'src/app/services';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {
  configEmailForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthServiceService, private _snackBar: MatSnackBar) {
    this.configEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  updateLoginData(user: { email: string; newEmail: string; password: string }) {
    this.auth.updateUserEmail(user).subscribe(
      () => {
        this._snackBar.open('Alteração executada com sucesso', 'Fechar');
      },
      () => {
        this._snackBar.open('Email ou password incorretos', 'Fechar');
      }
    );
  }
}
