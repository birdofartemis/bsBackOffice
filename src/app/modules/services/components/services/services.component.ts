import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthServiceService, FirestoreService } from 'src/app/services';
import { DeleteWarningComponent } from 'src/app/shared/components/delete-warning/delete-warning.component';
import { Collaborator } from 'src/app/shared/model/collaborator.model';
import { Service } from 'src/app/shared/model/service.model';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  animations: [
    //Animation to expand element
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription;
  //Observables
  serviceList!: MatTableDataSource<Service>;
  collaboratorList$!: Observable<Collaborator[]>;
  user$!: Observable<firebase.User | null>;

  //Columns that appear on table and its expanded element
  columnsToDisplay: string[];
  expandedElement!: Service | null;

  //Variables to access children from table
  @ViewChild(MatTable) table!: MatTable<Service>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fs: FirestoreService,
    private auth: AuthServiceService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.subscription = new Subscription();
    this.columnsToDisplay = ['name', 'price', 'actions'];
  }
  //Function that is called while component is being loaded.
  ngOnInit(): void {
    this.loadingService.updateLoading(false);

    //Not loaded data (streams)
    this.user$ = this.auth.getUserUID();
    this.collaboratorList$ = this.user$.pipe(switchMap((user) => this.fs.getCollaborators(user!.uid)));

    //Process service list data using uid of salon and implementing sort
    this.subscription.add(
      this.auth
        .getUserUID()
        .pipe(switchMap((user) => this.fs.getServices(user!.uid)))
        .subscribe((res) => {
          this.serviceList = new MatTableDataSource(res);
          this.serviceList.sort = this.sort;
          this.serviceList.paginator = this.paginator;
          this.loadingService.updateLoading(false);
        })
    );
  }

  //Called after OnInit function
  ngAfterViewInit(): void {
    this.loadingService.updateLoading(true);
  }

  //Redirect to service-form component
  addService(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['newservice'], { relativeTo: this.route });
  }

  //Redirect to service-form component and adds to url the service's document id
  editService(event: Event, service: Service): void {
    event.stopPropagation();
    void this.router.navigate(['newservice', service.idDocument], { relativeTo: this.route });
  }

  //Open dialog do confirm the deletion
  deleteService(event: Event, service: Service): void {
    event.stopPropagation();
    this.openDialog(service);
  }

  //Function that is used to open dialog
  private openDialog(service: Service): void {
    const name = service.name;
    //Service data that is sent to Delete Warning Component
    const dialofRef = this.dialog.open(DeleteWarningComponent, { data: { name: name, type: 'serviço' } });

    this.subscription.add(
      dialofRef.afterClosed().subscribe((res) => {
        //Res can be true if the user confirm the deletion or null
        if (res) {
          //Deletes the service on firestore
          this.fs.deleteServiceData(service.idDocument);
          //Updates service's table
          const index = this.serviceList.data.indexOf(service);
          this.serviceList.data.splice(index, 1);
          //Html informative snackBar element is opened
          this._snackBar.open(`${service.name} foi apagado com sucesso!`, 'Fechar');
        }
      })
    );
  }

  //This function is called on html and return the name of a collaborator using is citizen card
  getFirstCollaboratorName(cc: string, collab: Collaborator[] | null | undefined): string {
    return collab?.find((collab) => collab.citizenCard === cc)?.name || '';
  }

  //This function is called after the component is destroyed
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
