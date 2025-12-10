import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../../../services/order.service';
import { DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Order } from '../../../../../../types/order';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from '../../../../../../pipes/plural.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [
    DatePipe,
    RouterModule,
    TranslateModule,
    PluralPipe,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersAdminComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (orders) => (this.orders = orders),
      error: () => (this.orders = []),
    });
  }
}
