import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
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

  constructor(private authService: AuthService, private router: Router) {}

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
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            error.error?.error || 'Login failed. Please try again.'
          );
        },
      });
  }

  register() {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
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
            error.error?.error || 'Registration failed. Please try again.'
          );
        },
      });
  }
}
