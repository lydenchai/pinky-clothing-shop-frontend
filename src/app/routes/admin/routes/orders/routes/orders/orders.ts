import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../../../services/order.service';
import { DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Order } from '../../../../../../types/order';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from '../../../../../../pipes/plural.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaginationUtil } from '../../../../../../utils/pagination.util'; 
import { Pagination } from '../../../../../../components/pagination/pagination';
import { PaginationType } from '../../../../../../types/pagination-type';

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
export class OrdersAdmin
  extends PaginationUtil
  implements OnInit
{
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
