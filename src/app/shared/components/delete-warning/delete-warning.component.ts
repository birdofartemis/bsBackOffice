import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.scss']
})
export class DeleteWarningComponent {
  constructor(
    public dialofRef: MatDialogRef<DeleteWarningComponent>,
    //Get the data that was sent to dialog
    @Inject(MAT_DIALOG_DATA) public data: { name: string; type: string }
  ) {}

  //Return true if confirm deletation
  onConfirmation(): void {
    this.dialofRef.close(true);
  }
  //Closes the dialog
  onCancel(): void {
    this.dialofRef.close();
  }
}
