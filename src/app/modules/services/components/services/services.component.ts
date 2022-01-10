import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  serviceList!: MatTableDataSource<Service>;
  subscription: Subscription;
  columnsToDisplay: string[];
  expandedElement!: Service | null;
  collaboratorList$!: Observable<Collaborator[]>;
  user$!: Observable<firebase.User | null>;

  @ViewChild(MatTable) table!: MatTable<Service>;
  @ViewChild(MatSort) sort!: MatSort;

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

  ngOnInit(): void {
    this.loadingService.updateLoading(false);

    this.user$ = this.auth.getUserUID();
    this.collaboratorList$ = this.user$.pipe(switchMap((user) => this.fs.getCollaborators(user!.uid)));

    this.subscription.add(
      this.auth
        .getUserUID()
        .pipe(switchMap((user) => this.fs.getServices(user!.uid)))
        .subscribe((res) => {
          this.serviceList = new MatTableDataSource(res);
          this.serviceList.sort = this.sort;
          this.loadingService.updateLoading(false);
        })
    );
  }

  ngAfterViewInit(): void {
    this.loadingService.updateLoading(true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addService(): void {
    this.router.navigate(['newservice'], { relativeTo: this.route });
  }

  editService(event: Event, service: Service): void {
    event.stopPropagation();
    void this.router.navigate(['newservice', service.idDocument], { relativeTo: this.route });
  }

  deleteService(event: Event, service: Service): void {
    event.stopPropagation();
    this.openDialog(service);
  }

  private openDialog(service: Service): void {
    const name = service.name;
    const dialofRef = this.dialog.open(DeleteWarningComponent, { data: { name: name, type: 'serviço' } });

    this.subscription.add(
      dialofRef.afterClosed().subscribe((res) => {
        if (res) {
          this.fs.deleteServiceData(service.idDocument);
          const index = this.serviceList.data.indexOf(service);
          this.serviceList.data.splice(index, 1);
          this._snackBar.open(`${service.name} foi apagado com sucesso!`, 'Fechar');
        }
      })
    );
  }

  getFirstCollaboratorName(cc: string, collab: Collaborator[] | null | undefined): string {
    return collab?.find((collab) => collab.citizenCard === cc)?.name || '';
  }
}
