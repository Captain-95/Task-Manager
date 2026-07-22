import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  hidePassword = true;

  loading = false;

  currentSlide = 0;

  slides = [
  {
    icon: 'task_alt',
    title: 'Smart Task Tracking',
    subtitle:
      'Plan, organize and monitor your daily work with an intuitive task management experience. Stay focused and complete tasks on time.'
  },
  {
    icon: 'dashboard',
    title: 'Manage Through Dashboard',
    subtitle:
      'Get instant insights with a powerful dashboard showing total, pending and completed tasks through interactive charts and summaries.'
  },
  {
    icon: 'groups',
    title: 'Role Based Access',
    subtitle:
      'Secure JWT authentication with role-based permissions. Users can manage tasks while administrators control privileged operations.'
  },
  {
    icon: 'rocket_launch',
    title: 'Boost Productivity',
    subtitle:
      'Create, update, complete and manage tasks effortlessly using a fast, responsive and enterprise-grade application.'
  }
];

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  private intervalId!: number;

  ngOnInit(): void {

    this.intervalId = window.setInterval(() => {

    this.nextSlide();

    }, 4000);

  }

  ngOnDestroy(): void {

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

  }

  nextSlide(): void {

  this.currentSlide =
    (this.currentSlide + 1) % this.slides.length;

}

previousSlide(): void {

  this.currentSlide =
    (this.currentSlide - 1 + this.slides.length)
      % this.slides.length;

}

  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const request: LoginRequest = this.loginForm.getRawValue();

    this.authService.login(request).subscribe({

      next: (response) => {

        this.storageService.saveToken(response.token);
        this.storageService.saveUsername(response.username);
        this.storageService.saveRoles(response.roles);

        this.snackBar.open(
          'Login Successful',
          'Close',
          {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );

        this.router.navigate(['/dashboard']);

      },

      error: (err) => {

        console.error(err);

        this.snackBar.open(
          'Invalid Username or Password',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );

        this.loading = false;

      },

      complete: () => {

        this.loading = false;

      }

    });

  }

}