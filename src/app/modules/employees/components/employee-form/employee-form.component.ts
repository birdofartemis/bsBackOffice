import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Collaborator } from 'src/app/shared/model/collaborator.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  collaboratorForm: FormGroup;
  isEdit: boolean;

  textHeader: string;
  buttonExitText: string;
  buttonConfirmText: string;
  newPhoto?: string | ArrayBuffer;

  constructor(
    private fb: FormBuilder,
    private fs: FirestoreService,
    private auth: AuthServiceService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscription = new Subscription();
    this.isEdit = false;
    this.textHeader = 'Novo Colaborador';
    this.buttonExitText = 'Voltar';
    this.buttonConfirmText = 'Adicionar Funcionário';
    this.collaboratorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      citizenCard: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      taxIdNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params
        .pipe(
          filter(({ id }) => !!id),
          switchMap(({ id }) => this.fs.getCollaborator(id))
        )
        .subscribe((collaborator) => {
          this.collaboratorForm.patchValue(collaborator.data()!);
          this.isEdit = true;

          this.textHeader = 'Editar Colaborador';
          this.buttonExitText = 'Cancelar';
          this.buttonConfirmText = 'Concluir';
        })
    );
  }

  addCollaborator(event: Event, collaborator: Collaborator): void {
    event.stopPropagation();
    this.subscription.add(
      this.auth.getUserUID().subscribe(
        (res) => {
          collaborator.uidSallon = res!.uid;
          this.fs.addCollaboratorData(collaborator);
          this.collaboratorForm.reset();
          this._snackBar.open('Adicionado com sucesso!', 'Fechar');
        },

        () => {
          this._snackBar.open('Erro ao adicionar!', 'Fechar');
        }
      )
    );
  }

  editCollaborator(event: Event, collaborator: Collaborator): void {
    event.stopPropagation();
    this.fs.updateCollaborator(collaborator);
    this._snackBar.open('Atualizado com sucesso!', 'Fechar');
    this.router.navigate(['/home/employees'], { relativeTo: this.route });
  }

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
