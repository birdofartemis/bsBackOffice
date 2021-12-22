import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { DeleteWarningComponent } from '../../shared/components/delete-warning/delete-warning.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EmployeesRoutingModule } from './employees-routing.module';

@NgModule({
  declarations: [EmployeeFormComponent, EmployeesComponent, DeleteWarningComponent],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: EmployeesComponent }]
})
export class EmployeesModule {}
