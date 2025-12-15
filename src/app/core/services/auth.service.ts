import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../types/user.model';
import { AuthResponse } from '../types/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(
    this.getStoredToken()
  );
  token$ = this.tokenSubject.asObservable();

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private loadUserFromToken() {
    const token = this.getStoredToken();
    if (token) {
      this.getProfile().subscribe();
    } else {
      this.userSubject.next(null);
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('authToken', response.token);
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
        }),
        catchError((error) => {
          this.userSubject.next(null);
          throw error;
        })
      );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, {
        email,
        password,
        firstName,
        lastName,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('authToken', response.token);
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`).pipe(
      tap((user) => this.userSubject.next(user)),
      catchError((error) => {
        this.logout();
        throw error;
      })
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http
      .put<User>(`${environment.apiUrl}/auth/profile`, userData)
      .pipe(
        tap((user) => this.userSubject.next(user)),
        catchError((error) => {
          throw error;
        })
      );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value && !!this.getStoredToken();
  }

  getToken(): string | null {
    return this.getStoredToken();
  }
}
