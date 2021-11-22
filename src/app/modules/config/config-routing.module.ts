import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigPanelComponent } from './components/config-panel/config-panel.component';

const routes: Routes = [
  { path: '', component: ConfigPanelComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
