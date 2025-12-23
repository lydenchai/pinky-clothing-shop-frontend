import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from '../../../shared/pipes/plural.pipe';
import { Order } from '../../../core/types/order';
import { Product } from '../../../core/types/product.model';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    PluralPipe,
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  totalProducts = 0;
  lowStockCount = 0;
  pendingOrders = 0;
  completedOrders = 0;
  totalCustomers = 0;
  newCustomers = 0;
  sales = 0;

  get salesNumber(): number {
    const n = Number(this.sales);
    return isNaN(n) ? 0 : n;
  }

  conversionRate = 0;

  recentOrders: Order[] = [];
  topProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Inventory
    this.productService.getMany().subscribe((res) => {
      this.totalProducts = res.pagination.totalItems!;
      this.lowStockCount = res.data.filter(
        (p: any) => p.stock <= 5
      ).length;
    });

    // Orders
    this.orderService
      .getMany()
      .subscribe((res: { data: Order[]; pagination: any }) => {
        const orders = res.data;
        this.pendingOrders = orders.filter(
          (o) => o.status === 'pending'
        ).length;
        this.completedOrders = orders.filter(
          (o) => o.status === 'delivered'
        ).length;
        this.sales = orders.reduce((sum, o) => sum + o.total_amount, 0);
        // Recent orders (most recent 6)
        this.recentOrders = orders
          .slice()
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 6);
      });

    this.userService.getMany({ page: 1, limit: 100 }).subscribe({
      next: (res) => {
        this.totalCustomers = res.pagination?.totalItems ?? res.data.length;
        this.newCustomers = res.data.filter((u) => {
          if (!u.created_at) return false;
          const created = new Date(u.created_at).getTime();
          const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
          return created >= thirtyDaysAgo;
        }).length;
      },
      error: () => {
        this.totalCustomers = 0;
        this.newCustomers = 0;
      },
    });

    // Top products by stock (placeholder for top-sold)
    this.productService.getMany({ limit: 100 }).subscribe((res) => {
      this.topProducts = res.data
        .slice()
        .sort((a: Product, b: Product) => b.stock - a.stock)
        .slice(0, 6);
    });
  }
}
