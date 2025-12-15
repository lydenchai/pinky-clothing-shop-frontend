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
    this.cart.set(this.cartService.cart());
  }

  updateQuantity(cartItemId: number, quantity: number) {
    this.cartService.updateQuantity(cartItemId, quantity).subscribe({
      next: () => {
        // Refresh cart signal after update
        this.cart.set(this.cartService.cart());
      },
      error: (error) => {
        this.dialogService.error(
          this.translate.instant('message.failed_to_update_quantity')
        );
      },
    });
  }

  removeItem(cartItemId: number) {
    this.dialogService
      .ask(
        this.translate.instant('message.are_you_sure_remove_item'),
        this.translate.instant('message.remove_item')
      )
      .then((confirmed) => {
        if (confirmed) {
          this.cartService.removeItem(cartItemId).subscribe({
            next: () => {
              this.dialogService.success(
                this.translate.instant('message.item_removed_from_cart')
              );
              this.cart.set(this.cartService.cart());
            },
            error: () => {
              this.dialogService.error(
                this.translate.instant('message.failed_to_remove_item')
              );
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
    this.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(index: number) {
    const cart = this.cart();
    if (!cart || !cart.items || !cart.items[index]) {
      return;
    }
    const item = cart.items[index];
    if (item.quantity > 1) {
      this.updateQuantity(item.id, item.quantity - 1);
    }
  }

  formatPrice(price: any): string {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  }

  calculateItemTotal(price: any, quantity: number): string {
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return (numPrice * quantity).toFixed(2);
  }
}
