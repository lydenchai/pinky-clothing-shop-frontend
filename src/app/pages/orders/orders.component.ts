import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/user.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  orderService = inject(OrderService);
  orders: Order[] = [];

  constructor() {
    this.orderService.getOrders().subscribe({
      next: (orders) => (this.orders = orders),
      error: () => (this.orders = []),
    });
  }
}
