import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  templateUrl: './task-dialog.html',
  styleUrls: ['./task-dialog.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class TaskDialog {

  private fb = inject(FormBuilder);

  dialogRef = inject(MatDialogRef<TaskDialog>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  readonly MAX_DESCRIPTION = 500;

  form = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(150)
      ]
    ],

    description: [
      '',
      [
        Validators.maxLength(this.MAX_DESCRIPTION)
      ]
    ]

  });

  ngOnInit(): void {

    if (this.data?.mode === 'EDIT') {

      this.form.patchValue({

        name: this.data.task.name,

        description: this.data.task.description

      });

    }

  }

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.dialogRef.close(this.form.value);

  }

  close(): void {

    this.dialogRef.close();

  }

}