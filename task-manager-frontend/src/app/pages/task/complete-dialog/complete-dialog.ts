import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-complete-dialog',
  standalone: true,
  templateUrl: './complete-dialog.html',
  styleUrls: ['./complete-dialog.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CompleteDialog {

  private dialogRef = inject(MatDialogRef<CompleteDialog>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}