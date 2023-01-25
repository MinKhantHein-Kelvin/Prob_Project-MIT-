import { Component, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mat-confirm-dialog',
  templateUrl: './mat-confirm-dialog.component.html',
  styleUrls: ['./mat-confirm-dialog.component.scss']
})
export class MatConfirmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data : any,
  public dialogRef: MatDialogRef<MatConfirmDialogComponent>) { }

  closeDialog() {
    this.dialogRef.close(false);
  }

}
