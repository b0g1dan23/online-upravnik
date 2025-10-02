import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, tap, filter } from 'rxjs';
import { Card } from '../../components/ui/card/card';
import { Input } from '../../components/ui/input/input';
import { Button } from '../../components/ui/button/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BuildingsService, BuildingsShorthand } from '../../services/buildings';
import { Store } from '@ngrx/store';
import { UserActions } from '../../store/user/user.actions';
import { LoginDto, NestError, UserRoleEnum } from '../../store/user/user.model';
import { selectUser, selectUserError, selectUserLoading } from '../../store/user/user.selectors';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, Card, Input, Button],
  standalone: true,
  templateUrl: './login.html',
})
export class Login implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private store = inject(Store);
  public buildings = signal<BuildingsShorthand[]>([]);

  user$ = this.store.select(selectUser);
  loading$ = this.store.select(selectUserLoading);
  error$ = this.store.select(selectUserError);

  isRegisterMode = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private buildingsService: BuildingsService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.setupQueryParamSubscription();
    this.setupFormValueChanges();
    this.setupStoreSubscriptions();
    this.loadBuildings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      buildingLivingInID: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private setupQueryParamSubscription(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.isRegisterMode = params['mode'] === 'register';
      });
  }

  private setupFormValueChanges(): void {
    this.loginForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe();

    this.registerForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe();
  }

  private setupStoreSubscriptions(): void {
    this.user$.pipe(
      takeUntil(this.destroy$),
      filter(user => user !== null),
      tap(user => {
        this.snackBar.open(`Uspesna prijava! Dobrodosao ${user.firstName}`);
        this.navigateByRole(user.role);
      })
    ).subscribe();

    this.error$.pipe(
      takeUntil(this.destroy$),
      filter(err => err !== null),
      tap((err) => {
        this.snackBar.open(err.message);

        setTimeout(() => {
          this.store.dispatch(UserActions['[User]LoadUserSuccess']({ user: null }));
        }, 100);
      })
    ).subscribe();
  }

  private navigateByRole(role: UserRoleEnum): void {
    switch (role) {
      case UserRoleEnum.TENANT:
        this.router.navigate(['/tenant']);
        break;
      case UserRoleEnum.MANAGER:
        this.router.navigate(['/manager']);
        break;
      case UserRoleEnum.EMPLOYEE:
        this.router.navigate(['/employee']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  private loadBuildings(): void {
    this.buildingsService.getBuildingsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (buildings) => {
          this.buildings.set(buildings);
        },
        error: (err: NestError) => {
          this.snackBar.open(err.message);
        }
      });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors!['passwordMismatch'];
      if (Object.keys(confirmPassword.errors!).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginDto = this.loginForm.value;

      this.store.dispatch(UserActions['[Auth]Login']({ dto: loginData }));
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      const { confirmPassword, ...dataToSend } = registerData;

      this.store.dispatch(UserActions['[Auth]Register']({ dto: dataToSend }));
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  switchToRegister(): void {
    this.router.navigate([], {
      queryParams: {
        mode: 'register'
      }
    });
  }

  switchToLogin(): void {
    this.router.navigate([], {
      queryParams: {}
    });
  }
}