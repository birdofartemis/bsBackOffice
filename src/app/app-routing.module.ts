import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateAccountComponent } from './components/create-account/create-account.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MainComponent } from './main/components/main/main.component';


//const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signin', component: SignInComponent},
  {path: 'signin/account', component: CreateAccountComponent},
  {path: 'home', component: MainComponent/* , canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } */ },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
