import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {
  path: '', component: MenuComponent,
  children: [
    {path: '', component: DashboardComponent},
    {path: 'employees', loadChildren: () => import('../modules/employees/employees.module').then((m) => m.EmployeesModule)},
    {path: 'services', loadChildren: () => import('../modules/services/services.module').then((m) => m.ServicesModule)},
    {path: 'bookings', loadChildren: () => import('../modules/bookings/bookings.module').then((m) => m.BookingsModule)},
    {path: 'config', loadChildren: () => import('../modules/config/config.module').then((m) => m.ConfigModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
