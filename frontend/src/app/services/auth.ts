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
    this.refreshUserFromCookie();
  }

  login(dto: LoginDto) {
    return this.http.post<{ access_token: string }>(`${this.authURL}/login`, dto, {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap(() => {
        this.refreshUserFromCookie();
      }),
      switchMap(response => [response.body!])
    );
  }

  private refreshUserFromCookie() {
    this.http.get<User>(`http://localhost:8080/users/from-cookie`, {
      withCredentials: true
    }).subscribe({
      next: user => {
        console.log('✅ User fetched from cookie:', user);
        this.currentUserSubject.next(user);
      },
      error: (err) => {
        console.log('❌ Failed to get user from cookie:', err.status, err.message);
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
