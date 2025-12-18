import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CartService } from '../../../core/services/cart.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cart = signal<any | null>(null);

  constructor(
    private translate: TranslateService,
    private cartService: CartService,
    private dialogService: DialogService
  ) {
    this.cartService.getMany().subscribe({
      next: (res) => {
        this.cart.set(res.data);
      },
    });
  }

  removeItem(cart_item_id: string) {
    this.dialogService
      .ask(
        this.translate.instant('message.are_you_sure_remove_item'),
        this.translate.instant('message.remove_item')
      )
      .then((confirmed) => {
        if (confirmed) {
          this.cartService.delete(cart_item_id).subscribe({
            next: () => {
              this.dialogService.success(
                this.translate.instant('message.item_removed_from_cart')
              );
              this.cart.set(this.cartService.cart());
            },
          });
        }
      });
  }

  increaseQuantity(index: number) {
    const cart = this.cart();
    if (!cart || !cart.items || !cart.items[index]) {
      return;
    }
    const item = cart.items[index];
    this.updateQuantity(item._id, item.quantity + 1);
  }

  decreaseQuantity(index: number) {
    const cart = this.cart();
    if (!cart || !cart.items || !cart.items[index]) {
      return;
    }
    const item = cart.items[index];
    if (item.quantity > 1) {
      this.updateQuantity(item._id, item.quantity - 1);
    }
  }

  updateQuantity(cart_item_id: string, quantity: number) {
    this.cartService.updateQuantity(cart_item_id, quantity).subscribe({
      next: () => {
        this.cartService.getMany().subscribe({
          next: (res) => {
            // Always set as cart object with items property
            if (res.data) {
              this.cart.set(res.data);
            } else if (Array.isArray(res.data)) {
              this.cart.set({ items: res.data });
            } else {
              this.cart.set({ items: [] });
            }
          },
        });
      },
    });
  }
}
