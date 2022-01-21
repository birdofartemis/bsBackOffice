import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { EmployeesComponent } from '../employees/components/employees/employees.component';
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
    MatSelectModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: { useUtc: true } },
    { provide: MatPaginatorIntl, useClass: EmployeesComponent }
  ]
})
export class BookingsModule {}
