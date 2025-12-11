import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../types/order';
import { CreateOrderRequest } from '../types/create-order-request';
import { OrderSummaryRequest } from '../types/order-summary-request';
import { OrderSummary } from '../types/order-summary';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http
      .post<Order>(`${environment.apiUrl}/orders`, orderData)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getOrders(): Observable<{ data: Order[]; pagination: any }> {
    return this.http
      .get<{ data: Order[]; pagination: any }>(`${environment.apiUrl}/orders`)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${orderId}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http
      .put<Order>(`${environment.apiUrl}/orders/${orderId}/status`, { status })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getOrderSummary(summaryData: OrderSummaryRequest): Observable<OrderSummary> {
    return this.http
      .post<OrderSummary>(`${environment.apiUrl}/orders/summary`, summaryData)
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
