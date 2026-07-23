import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserDropdown } from '../../models/user-dropdown';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);

  private readonly API =
    `${environment.apiUrl}/users`;

  getAssignableUsers(): Observable<UserDropdown[]> {

    return this.http.get<UserDropdown[]>(
      `${this.API}/dropdown`
    );

  }

}