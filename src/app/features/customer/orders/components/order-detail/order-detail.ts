import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Order } from '../../../../../core/types/order';
import { OrderService } from '../../../../../core/services/order.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AddressPipe } from '../../../../../shared/pipes/address.pipe';

@Component({
  selector: 'app-order-detail',
  imports: [
    TranslateModule,
    DatePipe,
    MatIconModule,
    RouterLink,
    RouterModule,
    RouterLink,
    CurrencyPipe,
    AddressPipe
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail {
  order = signal<Order | null>(null);
  constructor(
    private readonly route: ActivatedRoute,
    private readonly orderService: OrderService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderService.getById(id!).subscribe({
      next: (order) => {
        this.order.set(order.data);
      },
    });
  }
}
