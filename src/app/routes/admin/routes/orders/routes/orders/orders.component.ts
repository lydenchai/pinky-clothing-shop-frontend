import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../../../services/order.service';
import { DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Order } from '../../../../../../types/order';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from '../../../../../../pipes/plural.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaginationComponentUtil } from '../../../../../../utils/pagination-component.util';
import { Pagination } from '../../../../../../types/pagination';
import { PaginationComponent } from '../../../../../../components/pagination/pagination.component';

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
    PaginationComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersAdminComponent
  extends PaginationComponentUtil
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

  getList(event: Pagination) {
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
