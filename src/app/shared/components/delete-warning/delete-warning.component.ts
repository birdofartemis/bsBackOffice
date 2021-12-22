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
    @Inject(MAT_DIALOG_DATA) public data: { name: string; type: string }
  ) {}

  onConfirmation(): void {
    this.dialofRef.close(true);
  }
  onCancel(): void {
    this.dialofRef.close();
  }
}
