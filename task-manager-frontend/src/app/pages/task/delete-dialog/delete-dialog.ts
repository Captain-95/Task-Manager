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
  selector: 'app-delete-dialog',
  standalone: true,
  templateUrl: './delete-dialog.html',
  styleUrls: ['./delete-dialog.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DeleteDialog {

  dialogRef = inject(MatDialogRef<DeleteDialog>);

  constructor(

    @Inject(MAT_DIALOG_DATA)
    public data:any

  ){}

  cancel():void{

    this.dialogRef.close(false);

  }

  delete():void{

    this.dialogRef.close(true);

  }

}