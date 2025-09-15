import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { Card } from '../../components/ui/card/card';
import { Input } from '../../components/ui/input/input';
import { Button } from '../../components/ui/button/button';
import { AuthService, LoginDto, UserRoleEnum } from '../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, Card, Input, Button],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isRegisterMode = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.setupQueryParamSubscription();
    this.setupFormValueChanges();
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
      confirmPassword: ['', [Validators.required]]
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

      this.authService.login(loginData)
        .pipe(tap(() => {
          this.snackBar.open("Uspesna prijava!");
        }))
        .subscribe({
          next: response => {
            const role = this.authService.getRole();
            if (role === null) {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
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

          },
          error: (err: HttpErrorResponse) => {
            this.authService.logout();
            this.router.navigate(['/login']);
            this.snackBar.open(err.error.message);
          }
        })
    } else {
      console.log('❌ Login forma nije validna');
      this.markFormGroupTouched(this.loginForm);
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      const { confirmPassword, ...dataToSend } = registerData;

      this.authService.register(dataToSend).pipe(
        tap(() => {
          this.snackBar.open("Uspesna registracija!");
        }),
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          const role = this.authService.getRole();
          if (role === null) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
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
        },
        error: (err: HttpErrorResponse) => {
          this.authService.logout();
          this.router.navigate(['/login']);
          this.snackBar.open(err.error.message);
        }
      })
    } else {
      console.log('❌ Register forma nije validna');
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