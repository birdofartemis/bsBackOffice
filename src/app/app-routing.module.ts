import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { CreateAccountComponent } from './components/create-account/create-account.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signin', component: SignInComponent},
  {path: 'signin/account', component: CreateAccountComponent},
  {path: 'dashboard', component: CreateAccountComponent, canActivate: [AngularFireAuthGuard] },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
