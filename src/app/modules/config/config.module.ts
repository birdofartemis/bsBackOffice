import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { FormDialogComponent } from './components/form-dialog/form-dialog.component';
import { ConfigRoutingModule } from './config-routing.module';

@NgModule({
  declarations: [ConfigPanelComponent, FormDialogComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    MatListModule,
    MatSlideToggleModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule
  ]
})
export class ConfigModule {}
