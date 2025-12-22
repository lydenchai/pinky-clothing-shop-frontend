import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../types/order';
import { OrderSummaryRequest } from '../types/order-summary-request';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseCrudService<Order> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/orders/';
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.httpClientService.patchJSON<Order>(
      `${this.path}/update/${id}/status`,
      {
        data: { status },
      }
    );
  }

  getOrderSummary(summaryData: OrderSummaryRequest) {
    return this.httpClientService.postJSON<any>(`${this.path}/summary`, {
      data: { summaryData },
    });
  }
}
