import { Component, OnInit } from "@angular/core";
import { CurrencyPipe, DatePipe, DecimalPipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";
import { PluralPipe } from "../../../shared/pipes/plural.pipe";
import { Order } from "../../../core/types/order";
import { Product } from "../../../core/types/product.model";
import { ProductService } from "../../../core/services/product.service";
import { OrderService } from "../../../core/services/order.service";
import { UserService } from "../../../core/services/user.service";
import { AnalyticsService } from "../../../core/services/analytics.service";

@Component({
  selector: "app-dashboard",
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    PluralPipe,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.scss"],
})
export class Dashboard implements OnInit {
  totalProducts = 0;
  lowStockCount = 0;
  pendingOrders = 0;
  completedOrders = 0;
  totalOrders = 0;
  sales = 0;
  salesToday = 0;
  salesMonth = 0;
  recentOrders: Order[] = [];
  topProducts: Product[] = [];
  recentActivities: any[] = [];

  get salesNumber(): number {
    const n = Number(this.sales);
    return Number.isNaN(n) ? 0 : n;
  }

  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  ngOnInit() {
    // Inventory
    this.productService.getMany().subscribe((res) => {
      this.totalProducts = res.pagination.totalItems!;
      this.lowStockCount = res.data.filter((p: any) => p.stock <= 5).length;
    });

    // Orders (for stats)
    this.orderService
      .getMany()
      .subscribe((res: { data: Order[]; pagination: any }) => {
        const orders = res.data;
        this.pendingOrders = orders.filter(
          (o) => o.status === "pending",
        ).length;
        this.completedOrders = orders.filter(
          (o) => o.status === "delivered",
        ).length;
      });

    // Fetch analytics summary for total sales, orders, and sales by day
    this.analyticsService.getSummary().subscribe({
      next: (res) => {
        this.sales = Number(res.data?.totalSales) || 0;
        this.totalOrders = Number(res.data?.totalOrders) || 0;
        // Sales summary (today/month)
        const today = new Date().toISOString().slice(0, 10);
        const month = new Date().toISOString().slice(0, 7);
        const salesByDay = res.data?.salesByDay || [];
        this.salesToday = 0;
        this.salesMonth = 0;
        for (const row of salesByDay) {
          const date = row.date || row["date"];
          const sales = Number(row.sales || row["sales"]);
          if (date === today) this.salesToday += sales;
          if (date && date.startsWith(month)) this.salesMonth += sales;
        }
      },
      error: () => {
        this.sales = 0;
        this.totalOrders = 0;
        this.salesToday = 0;
        this.salesMonth = 0;
      },
    });

    // Recent orders (for current user)
    this.orderService
      .getUserOrders()
      .subscribe((res: { data: Order[]; pagination: any }) => {
        const orders = res.data;
        this.recentOrders = orders
          .slice()
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 6);
      });

    // Recent activities (last 5 actions)
    this.analyticsService.getEvents().subscribe({
      next: (events: any) => {
        // Handle both array and { data: [] } response
        const arr = Array.isArray(events)
          ? events
          : events && events.data
            ? events.data
            : [];
        this.recentActivities = arr.slice(0, 5);
      },
      error: () => {
        this.recentActivities = [];
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
