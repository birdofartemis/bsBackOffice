import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthServiceService, FirestoreService } from 'src/app/services';
import { Booking } from 'src/app/shared/model/booking.model';
import { Collaborator } from 'src/app/shared/model/collaborator.model';
import { Service } from 'src/app/shared/model/service.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit, OnDestroy {
  bookingList!: MatTableDataSource<Booking>;
  collaboratorList$!: Observable<Collaborator[]>;
  serviceList$!: Observable<Service[]>;
  user$!: Observable<firebase.User | null>;
  displayedColumns: string[];
  subscription: Subscription;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  @ViewChild(MatTable) table!: MatTable<Booking>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private auth: AuthServiceService, private fs: FirestoreService, private router: Router, private route: ActivatedRoute) {
    this.subscription = new Subscription();
    this.displayedColumns = ['bookingHour', 'client', 'collaborator', 'service', 'price', 'actions'];
  }

  ngOnInit(): void {
    this.user$ = this.auth.getUserUID();
    this.collaboratorList$ = this.user$.pipe(switchMap((user) => this.fs.getCollaborators(user!.uid)));
    this.serviceList$ = this.user$.pipe(switchMap((user) => this.fs.getServices(user!.uid)));

    this.subscription.add(
      this.auth
        .getUserUID()
        .pipe(switchMap((user) => this.fs.getBookings(user!.uid)))
        .subscribe((res) => {
          this.bookingList = new MatTableDataSource(res);
          this.bookingList.sort = this.sort;
        })
    );
  }

  filterDate(event: MatDatepickerInputEvent<Date>) {
    this.bookingList.data = this.bookingList.data.filter((x) => x.date.getDate() == event.value?.getDate());
    this.bookingList._updateChangeSubscription();
  }

  addBooking(): void {
    this.router.navigate(['newbooking'], { relativeTo: this.route });
  }

  deleteBooking(event: Event, booking: Booking) {
    console.log(booking);
  }

  getFirstServiceName(id: string, services: Service[] | null | undefined): string {
    return services?.find((service) => service.idDocument === id)?.name || '';
  }

  getFirstServicePrice(id: string, services: Service[] | null | undefined): number {
    return services?.find((service) => service.idDocument === id)?.price || 0.0;
  }

  getFirstCollaboratorName(cc: string, collab: Collaborator[] | null | undefined): string {
    return collab?.find((collab) => collab.citizenCard === cc)?.name || '';
  }

  getTotalCost(services: Service[] | null | undefined): number | null {
    return (
      services
        ?.filter((x) => this.bookingList.data.map((id) => id.service).includes(x.idDocument))
        .map((service) => service.price)
        .reduce((acc, value) => acc + value, 0) || 0
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
