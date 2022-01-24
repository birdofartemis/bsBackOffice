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
    //Values to be used on service-form component html
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
          //Verifies if it carries an id in the url
          filter(({ id }) => !!id),
          switchMap(({ id }) => this.fs.getService(id)),
          tap((service: ServiceDoc) => {
            //If it carries, it patch the form with the data of the service
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

  //add service on firestore
  addService(event: Event, formValue: Service, user: firebase.User | null): void {
    event.stopPropagation();
    //String array of collaborator's ids or empty array if lenght is equal to zero
    const collaboratorIdList = formValue?.collaborator?.length ? formValue?.collaborator : [];
    //Adds do service object the collaborator's ids or an empty array
    const service: Service = { ...formValue, collaborator: collaboratorIdList };
    this.subscription.add(
      this.fs.addServiceData({ ...service, uidSallon: user!.uid }).subscribe(
        //sucess
        (res) => {
          //Adds idDocument to the service object to work as an id
          this.fs.updateServiceData({ ...service, idDocument: res.id });
          //Reset html form
          this.serviceForm.reset();
          //Opens html an html informative snack bar
          this._snackBar.open('Adicionado com sucesso!', 'Fechar');
        },
        //error
        () => {
          //Opens html an html informative snack bar
          this._snackBar.open('Erro ao adicionar!', 'Fechar');
        }
      )
    );
  }
  //Update on firestore an collaborator
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

  //Stores image
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
  //event when image change
  changeImage(): void {
    document!.getElementById('image')!.click();
  }

  //Used on Html to get collaborators name through  citizen's card
  getFirstCollaboratorName(cc: string, collab: Collaborator[] | null | undefined): string {
    return collab?.find((collab) => collab.citizenCard === cc)?.name || '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
