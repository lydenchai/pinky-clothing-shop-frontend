import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Order } from '../types/user.model';
import { environment } from '../../environments/environment';

export interface CreateOrderRequest {
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, orderData)
      .pipe(
        catchError(error => {
          console.error('Create order error:', error);
          throw error;
        })
      );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`)
      .pipe(
        catchError(error => {
          console.error('Get orders error:', error);
          throw error;
        })
      );
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${orderId}`)
      .pipe(
        catchError(error => {
          console.error('Get order error:', error);
          throw error;
        })
      );
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${environment.apiUrl}/orders/${orderId}/status`, { status })
      .pipe(
        catchError(error => {
          console.error('Update order status error:', error);
          throw error;
        })
      );
  }
}
