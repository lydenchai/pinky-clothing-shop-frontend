import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { DatePipe } from '@angular/common';
import { Order } from '../../../types/order';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersAdminComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() {}
}
