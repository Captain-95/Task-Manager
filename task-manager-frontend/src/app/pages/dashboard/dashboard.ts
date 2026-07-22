import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BaseChartDirective } from 'ng2-charts';

import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../models/dashboard-summary';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    BaseChartDirective
  ]
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);

  private snackBar = inject(MatSnackBar);

  private destroyRef = inject(DestroyRef);

  private cdr = inject(ChangeDetectorRef);

  @ViewChild('statusChart')
  statusChart?: BaseChartDirective;

  @ViewChild('weeklyChart')
  weeklyChart?: BaseChartDirective;

  @ViewChildren(BaseChartDirective)
  charts!: QueryList<BaseChartDirective>;

  loading = false;

  today = new Date();

  summary?: DashboardSummary;

  completionPercentage = 0;

  pendingPercentage = 0;

    doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {

    labels: [],

    datasets: [

      {

        data: [],

        backgroundColor: [

          '#22C55E',
          '#F59E0B'

        ],

        hoverBackgroundColor: [

          '#16A34A',
          '#D97706'

        ],

        borderWidth: 0,

        hoverOffset: 12,

        borderRadius: 6

      }

    ]

  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {

    responsive: true,

    maintainAspectRatio: true,

    cutout: '65%',

    plugins: {

      legend: {

        position: 'bottom',

        labels: {

          usePointStyle: true,

          pointStyle: 'circle',

          padding: 20

        }

      }

    }

  };

    // ============================================================
  // Weekly Line Chart
  // ============================================================

  lineChartData: ChartConfiguration<'line'>['data'] = {

    labels: [],

    datasets: [

      {

        label: 'Tasks',

        data: [],

        borderColor: '#2563EB',

        backgroundColor: 'rgba(37,99,235,.15)',

        fill: true,

        tension: .35,

        pointRadius: 5,

        pointHoverRadius: 7,

        pointBackgroundColor: '#2563EB'

      }

    ]

  };

  lineChartOptions: ChartOptions<'line'> = {

    responsive: true,

    maintainAspectRatio: true,

    plugins: {

    legend: {

        position: 'bottom',

        labels: {

            usePointStyle: true,

            pointStyle: 'circle',

            padding: 22,

            boxWidth: 10,

            font: {

                size: 13,

                weight: 500

            }
        }
    }
  },

    scales: {

      x: {

        grid: {

          display: false

        }

      },

      y: {

        beginAtZero: true,

        ticks: {

          precision: 0

        }

      }

    }

  };


  ngOnInit(): void {

    this.loadDashboard();

  }


  loadDashboard(): void {

    this.loading = true;

    this.dashboardService

      .getSummary()

      .pipe(

        takeUntilDestroyed(this.destroyRef),

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )

      .subscribe({

        next: (response) => {

          this.summary = response;

          this.calculateStatistics();

          this.initializeCharts();

        },

        error: () => {

          this.snackBar.open(

            'Unable to load dashboard.',

            'Close',

            {

              duration: 3000

            }

          );

        }

      });

  }


  private calculateStatistics(): void {

    if (!this.summary) {

      return;

    }

    if (this.summary.totalTasks === 0) {

      this.completionPercentage = 0;

      this.pendingPercentage = 0;

      return;

    }

    this.completionPercentage = Math.round(

      (this.summary.completedTasks / this.summary.totalTasks) * 100

    );

    this.pendingPercentage = Math.round(

      (this.summary.pendingTasks / this.summary.totalTasks) * 100

    );

  }


  private initializeCharts(): void {

    if (!this.summary) {

      return;

    }

    // ---------------- Doughnut ----------------

    this.doughnutChartData = {

      labels: this.summary.statusChart.map(item => item.label),

      datasets: [

        {

          data: this.summary.statusChart.map(item => item.value),

          backgroundColor: [

            '#F59E0B',
            '#22C55E'

          ],

          hoverBackgroundColor: [

            '#D97706',
            '#16A34A'

          ],

          borderWidth: 0,

          hoverOffset: 10,

          borderRadius: 6

        }

      ]

    };

    // ---------------- Weekly Line ----------------

    this.lineChartData = {

      labels: this.summary.weeklyChart.map(item => item.label),

      datasets: [

        {

          label: 'Tasks',

          data: this.summary.weeklyChart.map(item => item.value),

          borderColor: '#2563EB',

          backgroundColor: 'rgba(37,99,235,.12)',

          fill: true,

          tension: .4,

          pointRadius: 5,

          pointHoverRadius: 7,

          pointBackgroundColor: '#2563EB'

        }

      ]

    };

    this.refreshCharts();

  }

  private refreshCharts(): void {

  setTimeout(() => {

    this.charts.forEach(chart => chart.update());

  });

  }

}