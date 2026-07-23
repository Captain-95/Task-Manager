import {
  Component,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterOutlet,
  NavigationEnd,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { filter } from 'rxjs/operators';

import { Header } from '../header/header';

import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
      CommonModule,
      RouterOutlet,
      RouterLink,
      RouterLinkActive,
      Header,
      MatSidenavModule,
      MatListModule,
      MatIconModule
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayout implements AfterViewInit {

  @ViewChild(MatSidenav)
  drawer!: MatSidenav;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        if (this.drawer.mode === 'over') {

          this.drawer.close();

        }

      });

  }

}