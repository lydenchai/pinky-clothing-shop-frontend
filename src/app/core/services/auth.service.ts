import { LocalStorageService } from './local-storage.service';
import { Injectable, Injector } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { User } from '../types/user.model';
import { AuthResponse } from '../types/auth-response';
import { LocalStorageEnum } from '../types/enums/local-storage.enum';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseCrudService<any> {
  userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private tokenSubject: BehaviorSubject<string | null>;
  token$: Observable<string | null>;

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  constructor(
    injector: Injector,
    private localStorageService: LocalStorageService
  ) {
    super(injector);
    this.path = '/auth/';
    this.tokenSubject = new BehaviorSubject<string | null>(
      this.getStoredToken()
    );
    this.token$ = this.tokenSubject.asObservable();
    this.loadUserFromToken();
  }

  private getStoredToken(): string | null {
    return this.localStorageService.get(LocalStorageEnum.Token);
  }

  private loadUserFromToken() {
    const token = this.getStoredToken();
    if (token) {
      this.getProfile().subscribe({
        next: (res) => {
          this.userSubject.next(res.data || res.user || null);
        },
        error: () => {
          this.userSubject.next(null);
        },
      });
    } else {
      this.userSubject.next(null);
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const payload: any = {
      email,
      password,
    };
    return this.httpClientService
      .postJSON<AuthResponse>(`${this.path}/login`, { data: payload })
      .pipe(
        tap((res) => {
          this.localStorageService.set(LocalStorageEnum.Token, res.token);
          this.localStorageService.set(LocalStorageEnum.user_id, res.user._id!);
          this.tokenSubject.next(res.token);
          this.userSubject.next(res.user);
        })
      );
  }

  register(
    email: string,
    password: string,
    first_name: string,
    last_name: string
  ): Observable<AuthResponse> {
    const payload: any = {
      email,
      password,
      first_name,
      last_name,
    };
    return this.httpClientService
      .postJSON<AuthResponse>(`${this.path}/register`, { data: payload })
      .pipe(
        tap((res) => {
          this.localStorageService.set(LocalStorageEnum.Token, res.token);
          this.localStorageService.set(LocalStorageEnum.user_id, res.user._id!);
          this.tokenSubject.next(res.token);
          this.userSubject.next(res.user);
        })
      );
  }

  getProfile(): Observable<any> {
    return this.httpClientService.getJSON<any>(`${this.path}/profile`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.httpClientService.patchJSON<User>(`${this.path}/profile`, {
      data,
    });
  }

  logout() {
    this.httpClientService
      .postJSON<{ success: boolean; message: string }>(
        `${this.path}/logout`,
        {}
      )
      .subscribe();
    this.localStorageService.delete(LocalStorageEnum.Token);
    this.localStorageService.delete(LocalStorageEnum.user_id);
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
