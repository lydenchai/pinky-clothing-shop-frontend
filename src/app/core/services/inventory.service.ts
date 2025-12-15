import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InventoryItem } from '../types/inventory-item';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getAll(
    page = 1,
    limit = 10
  ): Observable<{ data: InventoryItem[]; pagination: any }> {
    return this.http
      .get<{ data: InventoryItem[]; pagination: any }>(this.apiUrl, {
        params: { page: page.toString(), limit: limit.toString() },
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  create(item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, item).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  update(id: number, item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.apiUrl}/${id}`, item).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  adjustStock(id: number, amount: number): Observable<InventoryItem> {
    return this.http
      .patch<InventoryItem>(`${this.apiUrl}/${id}/adjust`, { amount })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
