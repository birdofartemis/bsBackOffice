import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { ConfigRoutingModule } from './config-routing.module';

@NgModule({
  declarations: [ConfigPanelComponent],
  imports: [CommonModule, ConfigRoutingModule]
})
export class ConfigModule {}
