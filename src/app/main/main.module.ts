import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, MainRoutingModule]
})
export class MainModule {}
