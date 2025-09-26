import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, of, switchMap, take, tap } from 'rxjs';

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
  private isInitialized = new BehaviorSubject<boolean>(false);

  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromCookie();
  }

  login(dto: LoginDto): Observable<User> {
    return this.http.post(`${this.authURL}/login`, dto, {
      withCredentials: true
    }).pipe(
      switchMap(() => this.fetchUserFromServer()),
      tap(user => {
        this.currentUserSubject.next(user);
        this.isInitialized.next(true);
      })
    );
  }

  register(dto: RegisterDto): Observable<User> {
    return this.http.post(`${this.authURL}/register`, dto, {
      withCredentials: true
    }).pipe(
      switchMap(() => this.fetchUserFromServer())
    );
  }

  getCurrentUser(): Observable<User | null> {
    if (this.isInitialized.value) {
      return of(this.currentUserSubject.value);
    } else {
      return this.isInitialized.pipe(
        filter(initialized => initialized),
        take(1),
        map(() => this.currentUserSubject.value)
      );
    }
  }

  logout(): void {
    this.http.post(`${this.authURL}/logout`, {}, { withCredentials: true })
      .subscribe(() => this.currentUserSubject.next(null));
  }

  getRole() {
    return this.currentUser$.pipe(
      map(user => user?.role ?? null)
    );
  }

  hasRole(role: UserRoleEnum): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  private loadUserFromCookie(): void {
    this.fetchUserFromServer().subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        this.isInitialized.next(true);
      },
      error: () => {
        this.currentUserSubject.next(null);
        this.isInitialized.next(true);
      }
    });
  }

  private fetchUserFromServer(): Observable<User> {
    return this.http.get<User>(`http://localhost:8080/users/from-cookie`, {
      withCredentials: true
    }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }
}
