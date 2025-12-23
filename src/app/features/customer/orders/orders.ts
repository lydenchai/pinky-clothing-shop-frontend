import { Component, computed, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Order } from '../../../core/types/order';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/types/user.model';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { PaginationUtil } from '../../../utils/pagination.util';
import { PaginationType } from '../../../core/types/pagination-type';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, Pagination],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders extends PaginationUtil {
  orders: Order[] = [];
  user = signal<User | null>(null);
  
  isAdmin = computed(() => {
    const u = this.user();
    return !!u && (u as any).role === 'admin';
  });

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {
    super();
    this.authService.user$.subscribe((u) => this.user.set(u));
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.orderService
      .getMany({ page: event.page, limit: event.limit })
      .subscribe({
        next: (res) => {
          this.orders = res.data;
          this.totalCount = res?.pagination?.totalItems ?? 0;
          this.limit = event.limit;
          this.page = event.page;
        },
      });
  }
}
