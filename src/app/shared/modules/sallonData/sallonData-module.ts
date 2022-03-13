import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { PhotoModule } from '../photo/photo-module';
import { SelectBoxModule } from '../select-box/select-box.module';
import { CreateAccountComponent } from './component/create-account/create-account.component';
import { SallonDataRoutingModule } from './sallonData-routing.module';

@NgModule({
  declarations: [CreateAccountComponent],
  imports: [
    CommonModule,
    SallonDataRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    PhotoModule,
    SelectBoxModule
  ]
})
export class SallonDataModule {}
