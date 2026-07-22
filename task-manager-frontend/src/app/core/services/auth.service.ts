import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { LoginRequest } from '../../models/login-request';
import { JwtResponse } from '../../models/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly API = environment.apiUrl;

  login(request: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(
      `${this.API}/auth/login`,
      request
    );
  }

}