import { Component, OnInit } from '@angular/core'; 
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersAdminComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    // this.orderService.getAllOrders().subscribe((data) => {
    //   this.orders = data;
    //   this.loading = false;
    // });
  }
}
