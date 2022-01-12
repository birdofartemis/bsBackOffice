import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { AuthServiceService, FirestoreService } from 'src/app/services';
import { Collaborator } from 'src/app/shared/model/collaborator.model';
import { Service, ServiceDoc } from 'src/app/shared/model/service.model';

@Component({
  selector: 'app-services-form',
  templateUrl: './services-form.component.html',
  styleUrls: ['./services-form.component.scss']
})
export class ServicesFormComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  serviceForm: FormGroup;
  isEdit: boolean;

  textHeader: string;
  buttonExitText: string;
  buttonConfirmText: string;
  collaboratorList$!: Observable<Collaborator[]>;
  user$!: Observable<firebase.User | null>;
  idDocument?: string;

  constructor(
    private fb: FormBuilder,
    private fs: FirestoreService,
    private authService: AuthServiceService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscription = new Subscription();
    this.isEdit = false;
    this.textHeader = 'Novo Serviço';
    this.buttonExitText = 'Voltar';
    this.buttonConfirmText = 'Adicionar Serviço';
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      price: ['0.00', [Validators.required, Validators.min(0.01)]],
      collaborator: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.user$ = this.authService.getUserUID();
    this.collaboratorList$ = this.user$.pipe(switchMap((user) => this.fs.getCollaborators(user!.uid)));

    this.subscription.add(
      this.route.params
        .pipe(
          filter(({ id }) => !!id),
          switchMap(({ id }) => this.fs.getService(id)),
          tap((service: ServiceDoc) => {
            const values = service.data();
            this.serviceForm.patchValue(values || {});
            this.idDocument = values?.idDocument;

            this.isEdit = true;
            this.textHeader = 'Editar Serviço';
            this.buttonExitText = 'Cancelar';
            this.buttonConfirmText = 'Concluir';
          })
        )
        .subscribe()
    );
  }

  editService(event: Event, service: Service): void {
    event.stopPropagation();
    service.idDocument = this.idDocument || '';

    if (service.idDocument) {
      //success
      this.fs.updateServiceData(service);
      this._snackBar.open('Atualizado com sucesso!', 'Fechar');
      this.router.navigate(['/home/services'], { relativeTo: this.route });
    } else {
      //error
      this._snackBar.open('Erro ao atualizar serviço!', 'Fechar');
    }
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

  addService(event: Event, formValue: Service, user: firebase.User | null): void {
    event.stopPropagation();
    const service: Service = { ...formValue, collaborator: formValue?.collaborator?.length ? formValue?.collaborator : [] };
    this.subscription.add(
      this.fs.addServiceData({ ...service, uidSallon: user!.uid }).subscribe(
        (res) => {
          this.fs.updateServiceData({ ...service, idDocument: res.id });

          this.serviceForm.reset();
          this._snackBar.open('Adicionado com sucesso!', 'Fechar');
        },
        () => {
          this._snackBar.open('Erro ao adicionar!', 'Fechar');
        }
      )
    );
  }

  getFirstCollaboratorName(cc: string, collab: Collaborator[] | null | undefined): string {
    return collab?.find((collab) => collab.citizenCard === cc)?.name || '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
