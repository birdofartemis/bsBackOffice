import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingsComponent } from './components/bookings/bookings.component';

const routes: Routes = [
  { path: '', component: BookingsComponent },
  { path: 'newbooking', component: BookingFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule {}
