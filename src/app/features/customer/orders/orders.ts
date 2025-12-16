import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Order } from '../../../core/types/order';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {
    this.orderService.getMany().subscribe({
      next: (res) => (this.orders = res.data),
      error: () => (this.orders = []),
    });
  }
}
