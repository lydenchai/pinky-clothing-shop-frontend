import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { DialogService } from '../../services/dialog.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private cartService = inject(CartService);
  private dialogService = inject(DialogService);

  cart = this.cartService.cart;

  constructor(private translate: TranslateService) {}

  updateQuantity(cartItemId: number, quantity: number) {
    this.cartService.updateQuantity(cartItemId, quantity).subscribe({
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
    const item = this.cart().items[index];
    this.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(index: number) {
    const item = this.cart().items[index];
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
