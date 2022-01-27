import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/compat/app';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthServiceService, FirestoreService } from 'src/app/services';
import { Booking } from 'src/app/shared/model/booking.model';
import { Collaborator } from 'src/app/shared/model/collaborator.model';
import { Service } from 'src/app/shared/model/service.model';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  bookingForm: FormGroup;
  idDocument?: string;

  //Observables
  collaboratorList$!: Observable<Collaborator[]>;
  serviceList$!: Observable<Service[]>;
  user$!: Observable<firebase.User | null>;

  constructor(private fb: FormBuilder, private fs: FirestoreService, private auth: AuthServiceService, private _snackBar: MatSnackBar) {
    this.subscription = new Subscription();

    this.bookingForm = this.fb.group({
      client: ['', Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      service: ['', [Validators.required]],
      collaborator: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    //Not loaded data (streams)
    this.user$ = this.auth.getUserUID();
    this.collaboratorList$ = this.user$.pipe(switchMap((user) => this.fs.getCollaborators(user!.uid)));
    this.serviceList$ = this.user$.pipe(switchMap((user) => this.fs.getServices(user!.uid)));
  }

  addBooking(event: Event, formValue: Booking, user: firebase.User | null): void {
    event.stopPropagation();

    let time = this.bookingForm.get('hour')!.value.split(':');
    //Now date will have the correct hour and minutes
    formValue.date.setHours(time[0], time[1]);
    //Separating hours from the object that will be send to firestore
    const { hour, ...other } = formValue;
    //
    this.subscription.add(
      this.fs.addBookingData({ ...other, uidSallon: user!.uid }).subscribe(
        //sucess
        (res) => {
          //Adds idDocument to the booking object to work as an id
          this.fs.updateBookingData({ ...other, documentId: res.id });
          //Reset html form
          this.bookingForm.reset();
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
