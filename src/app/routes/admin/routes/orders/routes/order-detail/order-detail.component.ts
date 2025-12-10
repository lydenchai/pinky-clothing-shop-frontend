import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../../../services/order.service';
import { UserService } from '../../../../../../services/user.service';
import { Order } from '../../../../../../types/order';
import { User } from '../../../../../../types/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class AdminOrderDetailComponent implements OnInit {
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
    this.orderService.getOrderById(id!).subscribe({
      next: (order) => {
        this.order.set(order);
        if (typeof order.status === 'string') {
          this.status = order.status;
        } else if (order.status && typeof order.status === 'object') {
          this.status = Object.values(order.status)[0] as string;
        } else {
          this.status = '';
        }
        // Fetch user details
        if (order.userId) {
          this.userService.getAllUsers().subscribe({
            next: (res) => {
              const found = res.users.find(
                (u) => u.id === Number(order.userId)
              );
              this.user.set(found ?? null);
            },
          });
        }
      },
    });
  }

  updateStatus() {
    const order = this.order();
    if (!order) return;
    const currentStatus =
      typeof order.status === 'string'
        ? order.status
        : order.status && typeof order.status === 'object'
        ? Object.values(order.status)[0]
        : '';
    if (this.status === currentStatus) return;
    this.orderService.updateOrderStatus(order.id, this.status).subscribe({
      next: (updated) => {
        this.order.set(updated);
      },
    });
  }
}
