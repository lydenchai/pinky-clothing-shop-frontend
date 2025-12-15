import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PluralPipe } from '../../../../../shared/pipes/plural.pipe';
import { MatIconModule } from '@angular/material/icon';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { PaginationUtil } from '../../../../../utils/pagination.util';
import { OrderService } from '../../../../../core/services/order.service';
import { Order } from '../../../../../core/types/order';
import { PaginationType } from '../../../../../core/types/pagination-type';

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
    Pagination,
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
})
export class OrdersAdmin extends PaginationUtil implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {
    super();
  }

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (res) => (this.orders = res.data),
      error: () => (this.orders = []),
    });
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res.data ?? [];
        this.totalCount = res.pagination.totalItems;
        this.limit = event.limit;
        this.page = event.page;
      },
      error: (err) => {
        this.orders = [];
      },
    });
  }
}
