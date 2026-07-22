import { Injectable } from '@angular/core';

const TOKEN_KEY = 'access_token';
const USERNAME_KEY = 'username';
const ROLE_KEY = 'roles';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveUsername(username: string): void {
    localStorage.setItem(USERNAME_KEY, username);
  }

  getUsername(): string | null {
    return localStorage.getItem(USERNAME_KEY);
  }

  saveRoles(roles: string[]): void {
    localStorage.setItem(ROLE_KEY, JSON.stringify(roles));
  }

  // getRoles(): string[] {
  //   const roles = localStorage.getItem(ROLE_KEY);
  //   return roles ? JSON.parse(roles) : [];
  // }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clear(): void {
    localStorage.clear();
  }

  hasRole(role: string): boolean {
  const roles = this.getRoles() || [];
  return roles.includes(role);
}

isAdmin(): boolean {
  return this.hasRole('ROLE_ADMIN');
}

getRoles(): string[] {
  return JSON.parse(localStorage.getItem('roles') || '[]');
}

}