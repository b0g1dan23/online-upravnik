import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
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

  constructor(private http: HttpClient) { }

  login(dto: LoginDto) {
    return this.http.post<{ access_token: string }>(`${this.authURL}/login`, dto, {
      withCredentials: true
    })
  }

  getRole() {
    return this.currentUserRoleSubject.value;
  }

  hasRole(role: UserRoleEnum): boolean {
    return this.currentUserRoleSubject.value === role;
  }

  logout() {
    return this.http.post(`${this.authURL}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.currentUserRoleSubject.next(null))
    );
  }

  register(dto: RegisterDto) {
    console.log(dto);
    return this.http.post(`${this.authURL}/register`, dto, {
      withCredentials: true
    });
  }
}
