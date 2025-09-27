import { inject, Injectable } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { LoginDto, RegisterDto, User, UserRoleEnum } from '../store/user/user.model';
import { Store } from '@ngrx/store';
import { UserActions } from '../store/user/user.actions';
import { selectUser, selectUserRole } from '../store/user/user.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private store = inject(Store);

  constructor() {
    this.loadUserFromCookie();
  }

  login(dto: LoginDto) {
    this.store.dispatch(UserActions['[Auth]Login']({ dto }));
  }

  register(dto: RegisterDto) {
    this.store.dispatch(UserActions['[Auth]Register']({ dto }));
  }

  getCurrentUser(): Observable<User | null> {
    return this.store.select(selectUser);
  }

  logout(): void {
    this.store.dispatch(UserActions['[Auth]Logout']());
  }

  getRole() {
    return this.store.select(selectUserRole);
  }

  hasRole(role: UserRoleEnum) {
    return this.store.select(selectUserRole).pipe(
      map(userRole => userRole === role),
      take(1)
    );
  }

  public loadUserFromCookie(): void {
    this.store.dispatch(UserActions['[User]LoadUser']());
  }
}