import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TaskService } from '../../../core/services/task.service';

import { Task } from '../../../models/task';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskDialog } from '../task-dialog/task-dialog';
import { DeleteDialog } from '../delete-dialog/delete-dialog';
import { StorageService } from '../../../core/services/storage.service';
import { CompleteDialog } from '../complete-dialog/complete-dialog';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.scss'],
  imports: [
    CommonModule,
    FormsModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ]
})
export class TaskList implements OnInit, AfterViewInit {

  private taskService = inject(TaskService);

  private snackBar = inject(MatSnackBar);

  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'name',
    'description',
    'status',
    'createdDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<Task>();

  allTasks: Task[] = [];

  searchText = '';

  selectedStatus: string[] = [];

  loading = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  isAdmin = false;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {

    this.isAdmin = this.storageService.isAdmin();
    this.loadTasks();

  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

  }

  loadTasks(): void {

    this.loading = true;

    this.taskService.getAllTasks().subscribe({

      next: (response) => {

        this.allTasks = response;

        this.dataSource.data = response;

        this.loading = false;

      },

      error: () => {

        this.loading = false;

        this.snackBar.open(
          'Unable to load tasks',
          'Close',
          {
            duration: 3000
          }
        );

      }

    });

  }

  applySearch(event: Event): void {

    this.searchText = (event.target as HTMLInputElement).value;

    this.filterTasks();

  }

  onStatusChange(event: MatSelectChange): void {

    this.selectedStatus = event.value;

    this.filterTasks();

  }

  filterTasks(): void {

    let filtered = [...this.allTasks];

    if (this.searchText.trim()) {

      const keyword = this.searchText.toLowerCase();

      filtered = filtered.filter(task =>

        task.name.toLowerCase().includes(keyword)

        ||

        task.description?.toLowerCase().includes(keyword)

      );

    }

    if (this.selectedStatus.length > 0) {

      filtered = filtered.filter(task =>

        this.selectedStatus.includes(task.status)

      );

    }

    this.dataSource.data = filtered;

  }

  clearFilters(): void {

    this.searchText = '';

    this.selectedStatus = [];

    this.dataSource.data = [...this.allTasks];

  }

  refresh(): void {

    this.clearFilters();

    this.loadTasks();

  }

  addTask(): void {

  const dialogRef = this.dialog.open(TaskDialog, {

    width: '520px',

    disableClose: true,

    data: {

      mode: 'ADD'

    }

  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result) {

      return;

    }

    this.loading = true;

    this.taskService.createTask(result).subscribe({

      next: () => {

        this.snackBar.open(

          'Task created successfully',

          'Close',

          {

            duration: 2500

          }

        );

        this.loadTasks();

      },

      error: () => {

        this.loading = false;

        this.snackBar.open(

          'Unable to create task',

          'Close',

          {

            duration: 2500

          }

        );

      }

    });

  });

  }

  editTask(task: Task): void {

  const dialogRef = this.dialog.open(TaskDialog, {

    width: '520px',

    disableClose: true,

    data: {

      mode: 'EDIT',

      task

    }

  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result) {

      return;

    }

    this.taskService.updateTask(task.id, result).subscribe({

      next: () => {

        this.snackBar.open(
          'Task updated successfully',
          'Close',
          { duration: 2500 }
        );

        this.loadTasks();

      },

      error: () => {

        this.snackBar.open(
          'Unable to update task',
          'Close',
          { duration: 2500 }
        );

      }

    });

  });

  }

  completeTask(task: Task): void {

  const dialogRef = this.dialog.open(CompleteDialog, {

    width: '450px',

    disableClose: true,

    data: {
      task
    }

  });

  dialogRef.afterClosed().subscribe(result => {

    if (!result) {
      return;
    }

    this.taskService
      .updateTaskStatus(task.id, 'COMPLETED')
      .subscribe({

        next: () => {

          this.snackBar.open(
            'Task marked as completed successfully',
            'Close',
            {
              duration: 2500
            }
          );

          this.loadTasks();

        },

        error: () => {

          this.snackBar.open(
            'Unable to mark task as completed',
            'Close',
            {
              duration: 2500
            }
          );

        }

      });

  });

  }

  deleteTask(task: Task): void {

  const dialogRef = this.dialog.open(DeleteDialog,{

    width:'450px',

    disableClose:true,

    data:{
      task
    }

  });

  dialogRef.afterClosed().subscribe(result=>{

    if(!result){

      return;

    }

    this.taskService.deleteTask(task.id).subscribe({

      next:()=>{

        this.snackBar.open(

          'Task deleted successfully',

          'Close',

          {

            duration:2500

          }

        );

        this.loadTasks();

      },

      error:()=>{

        this.snackBar.open(

          'Unable to delete task',

          'Close',

          {

            duration:2500

          }

        );

      }

    });

  });

  }

}