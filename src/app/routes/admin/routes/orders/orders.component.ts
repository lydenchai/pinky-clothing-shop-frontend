import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../services/order.service';
import { DatePipe } from '@angular/common';
import { Order } from '../../../../types/order';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from '../../../../pipes/plural.pipe';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [DatePipe, TranslateModule, PluralPipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersAdminComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {}
}
