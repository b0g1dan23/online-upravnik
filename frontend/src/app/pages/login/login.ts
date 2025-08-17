import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, tap, switchMap, of } from 'rxjs';
import { Card } from '../../components/ui/card/card';
import { Input } from '../../components/ui/input/input';
import { Button } from '../../components/ui/button/button';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, Card, Input, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isRegisterMode = false;

  // Reactive Forms
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
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
    // Login forma
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Register forma
    this.registerForm = this.fb.group({
      ime: ['', [Validators.required, Validators.minLength(2)]],
      prezime: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
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
    // Login form changes
    this.loginForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        tap(values => console.log('Login form values:', values))
      )
      .subscribe();

    // Register form changes
    this.registerForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        tap(values => console.log('Register form values:', values))
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
      const loginData = this.loginForm.value;
      console.log('🚀 Šaljem login podatke na backend:', loginData);

      // Ovde poziveš svoj service za login
      // this.authService.login(loginData).subscribe(...)

      // Simulacija backend poziva
      of(loginData)
        .pipe(
          debounceTime(1000), // simulacija network delay
          tap(data => console.log('✅ Uspešan login:', data)),
          takeUntil(this.destroy$)
        )
        .subscribe();
    } else {
      console.log('❌ Login forma nije validna');
      this.markFormGroupTouched(this.loginForm);
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      // Uklanjamo confirmPassword pre slanja
      const { confirmPassword, ...dataToSend } = registerData;

      console.log('🚀 Šaljem register podatke na backend:', dataToSend);

      // Ovde poziveš svoj service za registraciju
      // this.authService.register(dataToSend).subscribe(...)

      // Simulacija backend poziva
      of(dataToSend)
        .pipe(
          debounceTime(1000), // simulacija network delay
          tap(data => console.log('✅ Uspešna registracija:', data)),
          switchMap(() => {
            // Nakon uspešne registracije, prebaci na login
            return of(this.switchToLogin());
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
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