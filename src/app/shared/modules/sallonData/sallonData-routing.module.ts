import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateAccountComponent } from './component/create-account/create-account.component';

const routes: Routes = [
  { path: '', component: CreateAccountComponent },
  { path: '/:id', component: CreateAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SallonDataRoutingModule {}
