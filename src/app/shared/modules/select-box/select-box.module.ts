import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { SelectBoxComponent } from './components/select-box/select-box.component';

@NgModule({
  declarations: [SelectBoxComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  exports: [SelectBoxComponent]
})
export class SelectBoxModule {}
