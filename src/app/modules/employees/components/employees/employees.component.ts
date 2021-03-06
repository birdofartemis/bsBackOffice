import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter, switchMap, switchMapTo } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

import { FirestoreService, StorageService } from '../../../../services';
import { DeleteWarningComponent } from '../../../../shared/components/delete-warning/delete-warning.component';
import { Collaborator } from '../../../../shared/model/collaborator.model';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy, MatPaginatorIntl {
  subscription: Subscription;
  //Paginator variable labels
  changes: Subject<void>;
  itemsPerPageLabel: string;
  nextPageLabel: string;
  previousPageLabel: string;
  firstPageLabel: string;
  lastPageLabel: string;

  //Columns that appear on table and its dataSource
  displayedColumns: string[] = ['photoUrl', 'name', 'email', 'phone', 'citizenCard', 'taxIdNumber', 'status', 'actions'];
  dataSource!: MatTableDataSource<Collaborator>;

  //Variables to access children from table
  @ViewChild(MatTable) table!: MatTable<Collaborator>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fs: FirestoreService,
    private auth: AngularFireAuth,
    private storage: StorageService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.subscription = new Subscription();

    //Variable values that are going to appear in the paginator
    this.firstPageLabel = 'Primeira p??gina';
    this.itemsPerPageLabel = 'Items por p??gina';
    this.nextPageLabel = 'Pr??xima p??gina';
    this.previousPageLabel = 'P??gina anterior';
    this.lastPageLabel = '??ltima p??gina';
    this.changes = new Subject<void>();
  }

  //Function that allows to update the page number in the paginator
  getRangeLabel(page: number, pageSize: number, length: number): string {
    const amountPages = Math.ceil(length / pageSize);
    return length === 0 ? `P??gina 1 de 1` : `P??gina ${page + 1} de ${amountPages}`;
  }

  //Function that is called while component is being loaded.
  ngOnInit(): void {
    //Loading bar appears while table is being processed
    this.loadingService.updateLoading(true);
    this.subscription.add(
      //Process array of Collaborators and activate sort and paginator
      this.auth.authState.pipe(switchMap((user) => this.fs.getCollaborators(user!.uid))).subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loadingService.updateLoading(false);
      })
    );
  }

  //Function that is called after keyup event on table's filter
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    event.stopPropagation();
  }

  //Redirect to employee-form component
  addColaborator(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['newemployee'], { relativeTo: this.route });
  }

  //Redirect to employee-form component and adds to url the collaborator's citizen card (id)
  editColaborator(event: Event, collaborator: Collaborator): void {
    event.stopPropagation();
    void this.router.navigate(['newemployee', collaborator.citizenCard], { relativeTo: this.route });
  }

  changeStatus(event: Event, collaborator: Collaborator): void {
    event.stopPropagation();
    if (collaborator.status === 'Dispon??vel') {
      collaborator.status = 'Ausente';
      this.fs.updateCollaborator(collaborator);
    } else {
      collaborator.status = 'Dispon??vel';
      this.fs.updateCollaborator(collaborator);
    }
  }

  //Open dialog do confirm the deletion
  deleteColaborator(event: Event, collaborator: Collaborator): void {
    event.stopPropagation();
    this.openDialog(collaborator);
  }

  //Function that is used to open dialog
  private openDialog(employee: Collaborator): void {
    const name = employee.name;
    //Collaborator data that is sent to Delete Warning Component
    const dialofRef = this.dialog.open(DeleteWarningComponent, { data: { name, type: 'colaborador' } });

    this.subscription.add(
      dialofRef
        .afterClosed()
        .pipe(
          filter((response) => !!response),
          switchMapTo(this.auth.authState),
          switchMap((user) => this.fs.triggerDeleteCollaboratorData(employee, user!.uid))
        )
        .subscribe((res) => {
          if (!res) {
            this.fs.deleteCollaboratorData(employee);

            //Updates collaborator's table
            const index = this.dataSource.data.indexOf(employee);
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
            if (employee.url) {
              this.storage.deletePhoto(employee.url);
            }
            //Html informative snackBar element is opened
            this._snackBar.open(`${employee.name} foi apagado com sucesso!`, 'Fechar');
          } else {
            this._snackBar.open(`O colaborador ${employee.name} n??o foi poss??vel de apagar pois est?? relacionado a um servi??o!`, 'Fechar');
          }
        })
    );
  }

  //This function is called after the component is destroyed
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
