import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../../../services/order.service';
import { Order } from '../../../../../../types/order';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class AdminOrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error: string | null = null;
  status: string = '';
  statusOptions: string[] = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderById(id).subscribe({
        next: (order) => {
          this.order = order;
          if (typeof order.status === 'string') {
            this.status = order.status;
          } else if (order.status && typeof order.status === 'object') {
            this.status = Object.values(order.status)[0] as string;
          } else {
            this.status = '';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Order not found';
          this.loading = false;
        },
      });
    } else {
      this.error = 'Order not found';
      this.loading = false;
    }
  }

  updateStatus() {
    if (!this.order) return;
    const currentStatus =
      typeof this.order.status === 'string'
        ? this.order.status
        : Object.values(this.order.status)[0];
    if (this.status === currentStatus) return;
    this.loading = true;
    this.orderService.updateOrderStatus(this.order.id, this.status).subscribe({
      next: (updated) => {
        this.order = updated;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
