import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { StorageService } from '../../core/services/storage.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {

  @ViewChild('drawer')
  drawer!: MatSidenav;

  isMobileMenuOpen = false;

  toggleMenu(): void {

    this.drawer.toggle();

  }

  private storage = inject(StorageService);

  private router = inject(Router);

  username = this.storage.getUsername() || 'User';

  get initial(): string {
    return this.username.charAt(0).toUpperCase();
  }

  logout(): void {

    this.storage.clear();

    this.router.navigate(['/login']);

  }

}