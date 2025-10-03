import {
  ChangeDetectionStrategy,
  Component, inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Button } from "../ui/button/button";
import { AuthService } from '../../services/auth';
import { UserRoleEnum } from '../../store/user/user.model';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser, selectUserRole } from '../../store/user/user.selectors';

interface NavItem {
  path: string;
  label: string;
  roles: UserRoleEnum[];
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Button],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);
  private destroy$ = new Subject<void>();
  private router = inject(Router);

  currentURL = new BehaviorSubject<string>(this.router.url);
  user$ = this.store.select(selectUser);
  userRole$ = this.store.select(selectUserRole);
  public navItems: NavItem[] = [];

  constructor() { }

  private navItemsConfig: NavItem[] = [
    { path: '/manager', label: 'Početna', roles: [UserRoleEnum.MANAGER] },
    { path: '/manager/employees', label: 'Zaposleni', roles: [UserRoleEnum.MANAGER] },
    { path: '/manager/buildings', label: 'Zgrade', roles: [UserRoleEnum.MANAGER] },

    { path: '/employee', label: 'Početna', roles: [UserRoleEnum.EMPLOYEE] },

    { path: '/tenant', label: 'Početna', roles: [UserRoleEnum.TENANT] },
  ]

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentURL.next(this.router.url);
    });

    this.userRole$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(role => {
      this.updateNavItems(role);
    });
  }

  private updateNavItems(role: UserRoleEnum | null): void {
    if (!role) {
      this.navItems = [];
      return;
    }
    this.navItems = this.navItemsConfig.filter(item => item.roles.includes(role));
  }

  isRouteActive(path: string) {
    return this.currentURL.value === path;
  }

  logout() {
    this.authService.logout();
  }
}
