import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EmployeesRoutingModule } from './employees-routing.module';


@NgModule({
  declarations: [EmployeeFormComponent, EmployeesComponent],
  imports: [
    CommonModule,
    EmployeesRoutingModule
  ]
})
export class EmployeesModule { }
