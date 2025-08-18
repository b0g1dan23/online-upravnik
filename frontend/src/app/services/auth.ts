import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'

export interface LoginDto {
  email: string;
  password: string;
}

export enum UserRoleEnum {
  MANAGER = 'MANAGER',
  TENANT = 'TENANT',
  EMPLOYEE = 'EMPLOYEE'
}

export interface JwtPayload {
  id: string;
  role: UserRoleEnum;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL = `http://localhost:8080/auth`;
  private currentUserRoleSubject = new BehaviorSubject<UserRoleEnum | null>(null);
  public currentUserRole$ = this.currentUserRoleSubject.asObservable();

  constructor(private http: HttpClient
  ) {
    this.loadUserFromToken();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  login(dto: LoginDto) {
    return this.http.post<{ access_token: string }>(`${this.authURL}/login`, dto)
      .pipe(
        tap(response => {
          localStorage.setItem('accessToken', response.access_token);
        })
      )
  }

  loadUserFromToken() {
    if (!this.isBrowser()) return;
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      this.currentUserRoleSubject.next(decoded.role);
    }
  }

  setToken(token: string) {
    if (!this.isBrowser()) return;
    localStorage.setItem('accessToken', token);
    const decoded = jwtDecode<JwtPayload>(token);
    this.currentUserRoleSubject.next(decoded.role);
  }

  getRole() {
    return this.currentUserRoleSubject.value;
  }

  hasRole(role: UserRoleEnum): boolean {
    return this.currentUserRoleSubject.value === role;
  }

  logout() {
    if (!this.isBrowser()) return;
    localStorage.removeItem('accessToken');
    this.currentUserRoleSubject.next(null);
  }
}
