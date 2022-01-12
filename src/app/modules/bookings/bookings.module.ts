import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingsComponent } from './components/bookings/bookings.component';

@NgModule({
  declarations: [BookingsComponent, BookingFormComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class BookingsModule {}
