import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { DashboardSummary } from '../../models/dashboard-summary';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly API =
    `${environment.apiUrl}/dashboard`;

  getSummary(): Observable<DashboardSummary> {

    return this.http.get<DashboardSummary>(
      `${this.API}/summary`
    );

  }

}