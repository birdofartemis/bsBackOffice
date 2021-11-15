import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ServicesFormComponent } from './components/services-form/services-form.component';
import { ServicesComponent } from './components/services/services.component';
import { ServicesRoutingModule } from './services-routing.module';


@NgModule({
  declarations: [
    ServicesComponent,
    ServicesFormComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule
  ]
})
export class ServicesModule { }
