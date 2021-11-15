import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthServiceService, FirestoreService } from 'src/app/services';
import { Collaborator } from 'src/app/shared/model/collaborator.module';
import { Service, ServiceForm } from 'src/app/shared/model/service.module';

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
  collaboratorList$!: Observable<Collaborator[]>;
  user$!: Observable<firebase.User | null>;

  constructor(
    private fb: FormBuilder, private fs: FirestoreService, 
    private auth: AngularFireAuth, private authService: AuthServiceService, 
    private _snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute
    ){ 

    this.subscription = new Subscription;
    this.isEdit = false;
    this.textHeader = 'Novo Serviço';
    this.buttonExitText = 'Voltar';
    this.buttonConfirmText = 'Adicionar Serviço';
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      price: ['0.00', [Validators.required, Validators.min(0.00)]],
      collaborator: ['']
    }); 
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.user$ = this.authService.getUserUID();
    this.collaboratorList$ = this.user$.pipe(switchMap(( user ) => this.fs.getCollaborators(user!.uid)));
  }

  editService(event: Event, service: Service): void {
    event.stopPropagation();
    this.fs.updateServiceData(service);
    this._snackBar.open('Atualizado com sucesso!', 'Fechar');
    this.router.navigate(['/home/services'], { relativeTo: this.route });
  }

  addService(event: Event, formValue: ServiceForm, user: firebase.User | null): void {
    event.stopPropagation();
    const service: Service = {...formValue, collaborator: formValue?.collaborator?.length ? formValue?.collaborator?.map(({ citizenCard }) => citizenCard) : []}
    this.subscription.add(
      this.fs.addServiceData({...service, uidSallon: user!.uid})
      .subscribe(() => { 
        this.serviceForm.reset();  
        this._snackBar.open('Adicionado com sucesso!', 'Fechar');
      }, 
      () => { 
        this._snackBar.open('Erro ao adicionar!', 'Fechar'); 
      })
    );
  }
}
