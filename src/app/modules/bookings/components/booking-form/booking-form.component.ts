import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
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
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  idDocument?: string;

  collaboratorList$!: Observable<Collaborator[]>;
  serviceList$!: Observable<Service[]>;
  user$!: Observable<firebase.User | null>;

  constructor(private fb: FormBuilder, private fs: FirestoreService, private auth: AuthServiceService, private _snackBar: MatSnackBar) {
    this.bookingForm = this.fb.group({
      client: ['', Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      service: ['', [Validators.required]],
      collaborator: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.user$ = this.auth.getUserUID();
    this.collaboratorList$ = this.user$.pipe(switchMap((user) => this.fs.getCollaborators(user!.uid)));
    this.serviceList$ = this.user$.pipe(switchMap((user) => this.fs.getServices(user!.uid)));
  }

  addBooking(event: Event, formValue: Booking, user: firebase.User | null): void {
    event.stopPropagation();

    let time = this.bookingForm.get('hour')!.value.split(':');
    formValue.date.setHours(time[0], time[1]);
    const { hour, ...other } = formValue;
    this.fs.addBookingData({ ...other, uidSallon: user!.uid }).subscribe(
      (res) => {
        this.fs.updateBookingData({ ...other, documentId: res.id });

        this.bookingForm.reset();
        this._snackBar.open('Adicionado com sucesso!', 'Fechar');
      },
      () => {
        this._snackBar.open('Erro ao adicionar!', 'Fechar');
      }
    );
  }
}
