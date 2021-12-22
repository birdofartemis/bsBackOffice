import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

import { FirestoreService } from '../../../../services';
import { DeleteWarningComponent } from '../../../../shared/components/delete-warning/delete-warning.component';
import { Collaborator } from '../../../../shared/model/collaborator.model';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy, AfterViewInit, MatPaginatorIntl {
  changes: Subject<void>;
  itemsPerPageLabel: string;
  nextPageLabel: string;
  previousPageLabel: string;
  firstPageLabel: string;
  lastPageLabel: string;

  displayedColumns: string[] = ['name', 'email', 'phone', 'citizenCard', 'taxIdNumber', 'actions'];
  dataSource!: MatTableDataSource<Collaborator>;
  subscription: Subscription;

  @ViewChild(MatTable) table!: MatTable<Collaborator>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fs: FirestoreService,
    private auth: AngularFireAuth,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.firstPageLabel = 'Primeira página';
    this.itemsPerPageLabel = 'Items por página';
    this.nextPageLabel = 'Próxima página';
    this.previousPageLabel = 'Página anterior';
    this.lastPageLabel = 'Última página';

    this.changes = new Subject<void>();

    this.subscription = new Subscription();
  }

  getRangeLabel(page: number, pageSize: number, length: number): string {
    const amountPages = Math.ceil(length / pageSize);
    return length === 0 ? `Página 1 de 1` : `Página ${page + 1} de ${amountPages}`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.auth.authState.pipe(switchMap((user) => this.fs.getCollaborators(user!.uid))).subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loadingService.updateLoading(false);
      })
    );
  }

  ngAfterViewInit(): void {
    //this.loadingService.updateLoading(true);
  }

  addColaborator(): void {
    this.router.navigate(['newemployee'], { relativeTo: this.route });
  }

  editColaborator(event: Event, collaborator: Collaborator): void {
    event.stopPropagation();
    void this.router.navigate(['newemployee', collaborator.citizenCard], { relativeTo: this.route });
  }

  deleteColaborator(event: Event, collaborator: Collaborator): void {
    event.stopPropagation();
    this.openDialog(collaborator);
  }

  private openDialog(employee: Collaborator): void {
    const name = employee.name;
    const dialofRef = this.dialog.open(DeleteWarningComponent, { data: { name, type: 'colaborador' } });

    this.subscription.add(
      dialofRef.afterClosed().subscribe((res) => {
        if (res) {
          this.fs.deleteCollaboratorData(employee);
          const index = this.dataSource.data.indexOf(employee);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
          this._snackBar.open(`${employee.name} foi apagado com sucesso!`, 'Fechar');
        }
      })
    );
  }
}
