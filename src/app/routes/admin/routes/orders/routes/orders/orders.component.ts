import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../../../services/order.service';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order } from '../../../../../../types/order';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from '../../../../../../pipes/plural.pipe';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [DatePipe, RouterModule, TranslateModule, PluralPipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersAdminComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (orders) => (this.orders = orders),
      error: () => (this.orders = []),
    });
  }
}
