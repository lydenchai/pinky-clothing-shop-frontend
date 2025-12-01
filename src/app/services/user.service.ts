import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { User } from '../types/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers(
    page = 1,
    limit = 10
  ): Observable<{ users: User[]; pagination: any }> {
    return this.http
      .get<{ users: User[]; pagination: any }>(`${environment.apiUrl}/users`, {
        params: { page: page.toString(), limit: limit.toString() },
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  updateUserRole(id: number, role: 'admin' | 'customer'): Observable<any> {
    return this.http
      .patch(`${environment.apiUrl}/users/${id}/role`, { role })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  saveUser(user: Partial<User>): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users`, user).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  updateUser(id: number, user: Partial<User>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}`, user).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}
