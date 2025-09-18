import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  buildingLivingInID: string;
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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRoleEnum;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL = `http://localhost:8080/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkExistingAuth();
  }

  private checkExistingAuth() {
    this.http.get<User>(`http://localhost:8080/users/from-cookie`, {
      withCredentials: true
    }).subscribe({
      next: user => this.currentUserSubject.next(user),
      error: () => {
        this.currentUserSubject.next(null);
      }
    });
  }

  login(dto: LoginDto) {
    const result = this.http.post<{ access_token: string }>(`${this.authURL}/login`, dto, {
      withCredentials: true
    }).pipe(
      tap(() => this.refreshUserFromCookie()))

    console.log(result)
    return result;
  }

  private refreshUserFromCookie() {
    return this.http.get<User>(`http://localhost:8080/users/from-cookie`, {
      withCredentials: true
    }).subscribe({
      next: user => this.currentUserSubject.next(user),
      error: () => {
        this.currentUserSubject.next(null);
      }
    });
  }

  getRole() {
    return this.currentUserSubject.value?.role ?? null;
  }

  hasRole(role: UserRoleEnum): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  logout() {
    return this.http.post(`${this.authURL}/logout`, {}, {
      withCredentials: true
    }).subscribe(() => this.currentUserSubject.next(null));
  }

  register(dto: RegisterDto) {
    return this.http.post(`${this.authURL}/register`, dto, {
      withCredentials: true
    });
  }
}
