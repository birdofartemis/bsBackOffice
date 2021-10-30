import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Collaborator } from 'src/app/shared/model/collaborator.module';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnDestroy {

  subscription: Subscription;
  collaboratorForm : FormGroup;

  constructor(private fb: FormBuilder, private fs: FirestoreService, private auth: AuthServiceService, private _snackBar: MatSnackBar) { 
    this.subscription = new Subscription;
    this.collaboratorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      citizenCard: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      taxIdNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addCollaborator(collaborator: Collaborator): void {
    this.subscription.add(
    this.auth.getUserUID().subscribe(
      res => {
        collaborator.uidSallon = res!.uid
        this.fs.addCollaboratorData(collaborator);
        this.collaboratorForm.reset();
        this._snackBar.open('Adicionado com sucesso!', 'Fechar');
      },

      () => {
        this._snackBar.open('Erro ao adicionar!', 'Fechar');
      }
    ));
    
    

  }

  

}
