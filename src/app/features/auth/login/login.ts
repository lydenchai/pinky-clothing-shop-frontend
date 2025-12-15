import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  showLoginPassword = false;
  showRegisterPassword = false;
  showRegisterConfirmPassword = false;
  isLogin = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  loginForm = {
    email: '',
    password: '',
  };

  registerForm = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  toggleMode() {
    this.isLogin.update((v) => !v);
    this.errorMessage.set('');
  }

  login() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .login(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          const role = response?.user?.role;
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            error.error?.error ||
              this.translate.instant('message.login_failed_please_try_again')
          );
        },
      });
  }

  register() {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage.set(
        this.translate.instant('message.passwords_do_not_match')
      );
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .register(
        this.registerForm.email,
        this.registerForm.password,
        this.registerForm.firstName,
        this.registerForm.lastName
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            error.error?.error ||
              this.translate.instant(
                'message.registration_failed_please_try_again'
              )
          );
        },
      });
  }
}
