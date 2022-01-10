import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingsComponent } from './components/bookings/bookings.component';

@NgModule({
  declarations: [BookingsComponent, BookingFormComponent],
  imports: [CommonModule, BookingsRoutingModule, MatButtonModule, MatTableModule, MatIconModule]
})
export class BookingsModule {}
