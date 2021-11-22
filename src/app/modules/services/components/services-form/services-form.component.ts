import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { AuthServiceService, FirestoreService } from 'src/app/services';
import { Collaborator } from 'src/app/shared/model/collaborator.module';
import { Service, ServiceDoc } from 'src/app/shared/model/service.module';

@Component({
  selector: 'app-services-form',
  templateUrl: './services-form.component.html',
  styleUrls: ['./services-form.component.scss']
})
export class ServicesFormComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  serviceForm : FormGroup;
  isEdit: boolean;
  
  textHeader: string;
  buttonExitText: string;
  buttonConfirmText: string;
  collaboratorEditList!: Collaborator[];
  collaboratorList$!: Observable<Collaborator[]>;
  user$!: Observable<firebase.User | null>;

  constructor(
    private fb: FormBuilder, private fs: FirestoreService, 
    private authService: AuthServiceService, 
    private _snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute
    ){ 

    this.subscription = new Subscription;
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
    this.collaboratorList$ = this.user$.pipe(switchMap(( user ) => this.fs.getCollaborators(user!.uid)));

    this.subscription.add(
      this.route.params.pipe(
        filter(({ id }) => !!id), 
        switchMap(({ id }) => this.fs.getService(id)), 
        tap((service: ServiceDoc) => {
          const values = service.data();
          this.serviceForm.patchValue(values || {});
          
          this.textHeader = 'Editar Serviço';
          this.buttonExitText = 'Cancelar';
          this.buttonConfirmText = 'Concluir';
        })).subscribe());
  }

  editService(event: Event, service: Service): void {
    event.stopPropagation();
    this.subscription.add(
      this.user$.subscribe( 
      //success
        () =>{
          this.fs.updateServiceData(service);
          this._snackBar.open('Atualizado com sucesso!', 'Fechar');
          this.router.navigate(['/home/services'], { relativeTo: this.route });
        },
    //error
        () => {
          this._snackBar.open('Erro ao atualizar serviço!', 'Fechar');
        })
      );
    }

  addService(event: Event, formValue: Service, user: firebase.User | null): void {
    event.stopPropagation();
    const service: Service = {...formValue, collaborator: formValue?.collaborator?.length ? formValue?.collaborator : []}
    this.subscription.add(
      this.fs.addServiceData({...service, uidSallon: user!.uid})
      .subscribe(res => {
        this.fs.updateServiceData({...service, idDocument: res.id});
        
        this.serviceForm.reset();  
        this._snackBar.open('Adicionado com sucesso!', 'Fechar');
      }, 
      () => { 
        this._snackBar.open('Erro ao adicionar!', 'Fechar'); 
      })
    );
  }

  getFirstCollaboratorName(cc: string, collab: Collaborator[] | null | undefined): string {
    return collab?.find((collab) => collab.citizenCard === cc)?.name || '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
