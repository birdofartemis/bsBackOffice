import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Collaborator } from '../../../../shared/model/collaborator.module';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.scss']
})
export class DeleteWarningComponent {

  constructor(public dialofRef: MatDialogRef<DeleteWarningComponent>, @Inject(MAT_DIALOG_DATA) public data: Collaborator) { }
  
  onConfirmation() : void {
    this.dialofRef.close(true);
  }
  onCancel(): void {
    this.dialofRef.close();
  }

}
