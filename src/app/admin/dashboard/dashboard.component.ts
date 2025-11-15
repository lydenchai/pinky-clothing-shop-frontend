import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
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

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Inventory
    this.productService.getAllProducts().subscribe((response) => {
      this.totalProducts = response.products.length;
      this.lowStockCount = response.products.filter(p => p.stock <= 5).length;
    });

    // Orders
    this.orderService.getOrders().subscribe((orders: Order[]) => {
      this.pendingOrders = orders.filter(o => o.status === 'pending').length;
      this.completedOrders = orders.filter(o => o.status === 'delivered').length;
      this.sales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    });

    // Customers (stub, replace with real API when available)
    // this.userService.getAllUsers().subscribe((users: User[]) => {
    //   this.totalCustomers = users.length;
    //   this.newCustomers = users.filter(u => /* logic for new this month */).length;
    // });

    // Analytics (stub, replace with real API when available)
    // this.analyticsService.getKPIs().subscribe((data) => {
    //   this.conversionRate = data.conversionRate;
    // });
  }
}
