import { ChangeDetectorRef, Component, Inject, OnInit, inject } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';

import { UserService } from '../../../core/services/user.service';
import { UserDropdown } from '../../../models/user-dropdown';

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
    MatIconModule,
    MatSelectModule
  ]
})
export class TaskDialog implements OnInit {

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  private userService = inject(UserService);

  dialogRef = inject(MatDialogRef<TaskDialog>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  readonly MAX_DESCRIPTION = 500;

  users: UserDropdown[] = [];

  form = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(150)
      ]
    ],

    assignedUserId: [null as number | null, Validators.required],

    description: [
      '',
      Validators.maxLength(this.MAX_DESCRIPTION)
    ]

  });

  ngOnInit(): void {

    this.loadUsers();

    if (this.data?.mode === 'EDIT') {

      this.form.patchValue({

        name: this.data.task.name,

        description: this.data.task.description,

        assignedUserId: this.data.task.userId

      });

    }

  }

  loadUsers(): void {
    this.userService.getAssignableUsers().subscribe({
      next: users => {
        this.users = users;
        this.cdr.detectChanges();
      }
    });
  }

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.dialogRef.close(this.form.getRawValue());

  }

  close(): void {

    this.dialogRef.close();

  }

}