import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { ConfigRoutingModule } from './config-routing.module';

@NgModule({
  declarations: [ConfigPanelComponent],
  imports: [CommonModule, ConfigRoutingModule, MatListModule, MatSlideToggleModule]
})
export class ConfigModule {}
