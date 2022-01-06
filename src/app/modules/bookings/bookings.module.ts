import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingsComponent } from './components/bookings/bookings.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';


@NgModule({
  declarations: [
    BookingsComponent,
    BookingFormComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule
  ]
})
export class BookingsModule { }
