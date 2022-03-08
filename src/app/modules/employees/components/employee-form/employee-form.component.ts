import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { StorageService } from 'src/app/services';
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

  @ViewChild('photoInput') photoInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private fs: FirestoreService,
    private auth: AuthServiceService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService
  ) {
    this.subscription = new Subscription();

    //Values to be used on employee-form component html
    this.isEdit = false;
    this.textHeader = 'Novo Colaborador';
    this.buttonExitText = 'Voltar';
    this.buttonConfirmText = 'Adicionar Funcionário';

    this.collaboratorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.validateLenght('phone', 9)]],
      citizenCard: ['', [Validators.required, this.validateLenght('citizenCard', 8)]],
      taxIdNumber: ['', [Validators.required, this.validateLenght('taxIdNumber', 8)]],
      url: ['']
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      //Verifies if it carries an id in the url
      this.route.params
        .pipe(
          filter(({ id }) => !!id),
          switchMap(({ id }) => this.fs.getCollaborator(id))
        )
        .subscribe((collaborator) => {
          //If it carries, it patch the form with the data of the collaborator
          this.collaboratorForm.patchValue(collaborator.data()!);
          this.isEdit = true;

          this.textHeader = 'Editar Colaborador';
          this.buttonExitText = 'Cancelar';
          this.buttonConfirmText = 'Concluir';
        })
    );
  }

  //Custom Validator to validate lenght of field
  validateLenght(field: string, lenght: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fieldValue = control.parent?.get(field)?.value as string;
      return fieldValue?.length - lenght === 0 ? null : { errorLenght: true };
    };
  }

  //add collaborator on firestore
  addCollaborator(event: Event, collaborator: Collaborator): void {
    event.stopPropagation();
    this.subscription.add(
      this.auth.getUserUID().subscribe(
        //sucess
        (res) => {
          //patch value uidSalon with user id (primary key)
          collaborator.status = 'Disponível';
          this.fs.addCollaboratorData({ ...collaborator, uidSalon: res!.uid });
          //Reset html form
          this.collaboratorForm.reset();
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
  editCollaborator(event: Event, collaborator: Collaborator): void {
    event.stopPropagation();
    this.fs.updateCollaborator(collaborator);

    this._snackBar.open('Atualizado com sucesso!', 'Fechar');
    //Redirects to employee component
    this.router.navigate(['/home/employees'], { relativeTo: this.route });
  }

  onCancelButton(event: Event) {
    event.stopPropagation();
    if (!this.isEdit && this.collaboratorForm.get('url')!.value) {
      this.storage.deletePhoto(this.collaboratorForm.get('url')!.value);
    }
    this.router.navigate(['/home/employees'], { relativeTo: this.route });
  }

  //Stores image
  changeImage(event: MouseEvent): void {
    event.stopPropagation();
    if (event.isTrusted) {
      this.photoInput.nativeElement.click();
    }
  }

  photoInputChange(event: any): void {
    if (event && this.collaboratorForm.get('url')!.value) {
      this.storage.deletePhoto(this.collaboratorForm.get('url')!.value);
      this.storage.uploadFile(event, UUID.UUID()).subscribe((res) => {
        this.collaboratorForm.get('url')?.setValue(`gs://${res.ref.bucket}/${res.ref.fullPath}`);
      });
    } else {
      this.storage.uploadFile(event, UUID.UUID()).subscribe((res) => {
        this.collaboratorForm.get('url')?.setValue(`gs://${res.ref.bucket}/${res.ref.fullPath}`);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
