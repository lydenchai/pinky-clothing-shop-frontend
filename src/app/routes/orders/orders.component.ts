import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { TranslateModule } from '@ngx-translate/core';
import { Order } from '../../types/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {
    this.orderService.getOrders().subscribe({
      next: (orders) => (this.orders = orders),
      error: () => (this.orders = []),
    });
  }
}
