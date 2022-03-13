import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, MainRoutingModule, MatIconModule]
})
export class MainModule {}
