import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { OrderService } from '../../../../services/order.service';
import { UserService } from '../../../../services/user.service';
import { Product } from '../../../../types/product.model';
import { Order } from '../../../../types/order';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from "../../../../pipes/plural.pipe";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    PluralPipe
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  lowStockCount = 0;
  pendingOrders = 0;
  completedOrders = 0;
  totalCustomers = 0;
  newCustomers = 0;
  sales = 0;
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
    this.productService.getAllProducts().subscribe((response) => {
      this.totalProducts = response.products.length;
      this.lowStockCount = response.products.filter((p) => p.stock <= 5).length;
    });

    // Orders
    this.orderService.getOrders().subscribe((orders: Order[]) => {
      this.pendingOrders = orders.filter((o) => o.status === 'pending').length;
      this.completedOrders = orders.filter(
        (o) => o.status === 'delivered'
      ).length;
      this.sales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      // Recent orders (most recent 6)
      this.recentOrders = orders
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6);
    });

    this.userService.getAllUsers(1, 100).subscribe({
      next: (res) => {
        this.totalCustomers = res.pagination?.totalItems ?? res.users.length;
        this.newCustomers = res.users.filter((u) => {
          if (!u.createdAt) return false;
          const created = new Date(u.createdAt).getTime();
          const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
          return created >= thirtyDaysAgo;
        }).length;
      },
      error: () => {
        this.totalCustomers = 0;
        this.newCustomers = 0;
      },
    });

    // Analytics (stub, replace with real API when available)
    // this.analyticsService.getKPIs().subscribe((data) => {
    //   this.conversionRate = data.conversionRate;
    // });

    // Top products by stock (placeholder for top-sold)
    this.productService.getAllProducts({ limit: 100 }).subscribe((res) => {
      this.topProducts = res.products
        .slice()
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 6);
    });
  }
}
