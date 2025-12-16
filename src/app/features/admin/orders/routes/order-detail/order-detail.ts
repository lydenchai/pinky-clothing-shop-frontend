import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { PluralPipe } from '../../../../../shared/pipes/plural.pipe';
import { Order } from '../../../../../core/types/order';
import { User } from '../../../../../core/types/user.model';
import { OrderService } from '../../../../../core/services/order.service';
import { UserService } from '../../../../../core/services/user.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatChipsModule,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    PluralPipe,
  ],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.scss'],
})
export class AdminOrderDetail implements OnInit {
  order = signal<Order | null>(null);
  status: string = '';
  statusOptions: string[] = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];
  user = signal<User | null>(null);

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderService.getById(id!).subscribe({
      next: (order) => {
        this.order.set(order.data);
        if (typeof order.data.status === 'string') {
          this.status = order.data.status.toString().toLowerCase().trim();
        } else if (order.data.status && typeof order.data.status === 'object') {
          this.status = String(Object.values(order.data.status)[0])
            .toLowerCase()
            .trim();
        } else {
          this.status = '';
        }
        // Fetch user details
        if (order.data.userId) {
          this.userService.getMany().subscribe({
            next: (res) => {
              const found = res.data.find(
                (u) => u.id === Number(order.data.userId)
              );
              this.user.set(found ?? null);
            },
          });
        }
      },
    });
  }

  updateStatus(value: string) {
    const order = this.order();
    if (!order) return;
    const newStatus = String(value).toLowerCase().trim();
    const currentStatus =
      typeof order.status === 'string'
        ? order.status.toString().toLowerCase().trim()
        : order.status && typeof order.status === 'object'
        ? String(Object.values(order.status)[0]).toLowerCase().trim()
        : '';
    if (newStatus === currentStatus) return;
    this.status = newStatus;
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updated) => {
        this.order.set(updated);
      },
    });
  }
}
