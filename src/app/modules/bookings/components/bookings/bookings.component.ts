import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
import { Booking } from 'src/app/shared/model/booking.model';
import { Collaborator } from 'src/app/shared/model/collaborator.model';
import { Service } from 'src/app/shared/model/service.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  //Observables
  bookingList!: MatTableDataSource<Booking>;
  collaboratorList$!: Observable<Collaborator[]>;
  serviceList$!: Observable<Service[]>;
  user$!: Observable<firebase.User | null>;

  //Columns that appear on table and its expanded element
  displayedColumns: string[];

  //Variables to access children from table
  @ViewChild(MatTable) table!: MatTable<Booking>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private auth: AuthServiceService,
    private fs: FirestoreService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.subscription = new Subscription();
    this.displayedColumns = ['bookingHour', 'client', 'collaborator', 'service', 'price', 'actions'];
  }
  //Function that is called while component is being loaded.
  ngOnInit(): void {
    this.user$ = this.auth.getUserUID();
    //Not loaded data (streams)
    this.collaboratorList$ = this.user$.pipe(switchMap((user) => this.fs.getCollaborators(user!.uid)));
    this.serviceList$ = this.user$.pipe(switchMap((user) => this.fs.getServices(user!.uid)));

    //Process booking list data using uid of salon and implementing sort and paginator
    this.subscription.add(
      this.auth
        .getUserUID()
        .pipe(switchMap((user) => this.fs.getBookings(user!.uid)))
        .subscribe((res) => {
          this.bookingList = new MatTableDataSource(res);
          this.bookingList.sort = this.sort;
          this.bookingList.paginator = this.paginator;
        })
    );
  }
  //Date filter that will be used to filter the booking table
  filterDate(event: MatDatepickerInputEvent<Date>): void {}

  //Redirect to service-form component
  addBooking(): void {
    this.router.navigate(['newbooking'], { relativeTo: this.route });
  }

  //Open dialog do confirm the deletion
  deleteBooking(event: Event, booking: Booking): void {
    event.stopPropagation();
    this.openDialog(booking);
  }

  //Function that is used to open dialog
  private openDialog(booking: Booking): void {
    const name = booking.client;
    //Booking data that is sent to Delete Warning Component
    const dialofRef = this.dialog.open(DeleteWarningComponent, { data: { name: name, type: 'agendamento' } });

    this.subscription.add(
      dialofRef.afterClosed().subscribe((res) => {
        //Res can be true if the user confirm the deletion or null
        if (res) {
          //Deletes the booking on firestore
          this.fs.deleteBookingData(booking);
          //Updates booking's table
          const index = this.bookingList.data.indexOf(booking);
          this.bookingList.data.splice(index, 1);
          //Html informative snackBar element is opened
          this._snackBar.open(`O agendamento com o cliente ${booking.client} foi apagado com sucesso!`, 'Fechar');
        }
      })
    );
  }
  //This function is called on html and return the name of a service using is idDocument
  getFirstServiceName(id: string, services: Service[] | null | undefined): string {
    return services?.find((service) => service.idDocument === id)?.name || '';
  }

  //This function is called on html and return the price of a service using is idDocument
  getFirstServicePrice(id: string, services: Service[] | null | undefined): number {
    return services?.find((service) => service.idDocument === id)?.price || 0.0;
  }
  //This function is called on html and return the name of a collaborator using is citizen card
  getFirstCollaboratorName(cc: string, collab: Collaborator[] | null | undefined): string {
    return collab?.find((collab) => collab.citizenCard === cc)?.name || '';
  }
  //This function is called on html and return the profits of a day
  getTotalCost(services: Service[] | null | undefined): number | null {
    return (
      services
        ?.filter((x) => this.bookingList.data.map((id) => id.service).includes(x.idDocument))
        .map((service) => service.price)
        .reduce((acc, value) => acc + value, 0) || 0
    );
  }
  //This function is called after the component is destroyed
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
