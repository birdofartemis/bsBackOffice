import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServicesFormComponent } from './components/services-form/services-form.component';
import { ServicesComponent } from './components/services/services.component';

const routes: Routes = [
  { path: '', component: ServicesComponent },
  { path: 'newservice', component: ServicesFormComponent },
  { path: 'newservice/:id', component: ServicesFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
