import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigPanelComponent } from './components/config-panel/config-panel.component';

const routes: Routes = [
  { path: '', component: ConfigPanelComponent },
  {
    path: 'sallonData/:id',
    loadChildren: () => import('../../shared/modules/sallonData/sallonData-module').then((m) => m.SallonDataModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule {}
