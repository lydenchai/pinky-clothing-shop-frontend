import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { User, Order, AuthResponse } from '../types/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(
    this.getStoredToken()
  );

  user = this.currentUser.asReadonly();
  token$ = this.tokenSubject.asObservable();

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
          this.currentUser.set(response.user);
        }),
        catchError((error) => {
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
          this.currentUser.set(response.user);
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`).pipe(
      tap((user) => this.currentUser.set(user)),
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
        tap((user) => this.currentUser.set(user)),
        catchError((error) => {
          throw error;
        })
      );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.tokenSubject.next(null);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null && !!this.getStoredToken();
  }

  getToken(): string | null {
    return this.getStoredToken();
  }
}
