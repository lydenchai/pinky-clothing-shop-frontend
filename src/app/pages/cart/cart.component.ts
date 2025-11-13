import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { DialogService } from '../../services/dialog.service';
import { TranslateModule } from '@ngx-translate/core';

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

  updateQuantity(cartItemId: number, quantity: number) {
    this.cartService.updateQuantity(cartItemId, quantity).subscribe({
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.dialogService.error(
          'Failed to update quantity. Please try again.'
        );
      },
    });
  }

  removeItem(cartItemId: number) {
    console.log(
      'Remove item called with ID:',
      cartItemId,
      'Type:',
      typeof cartItemId
    );
    this.dialogService
      .ask(
        'Are you sure you want to remove this item from your cart?',
        'Remove Item'
      )
      .then((confirmed) => {
        if (confirmed) {
          console.log('User confirmed removal, calling service...');
          this.cartService.removeItem(cartItemId).subscribe({
            next: () => {
              console.log('Item removed successfully');
              this.dialogService.success('Item removed from cart');
            },
            error: (error) => {
              console.error('Error removing item:', error);
              console.error('Error status:', error.status);
              console.error('Error message:', error.error);
              this.dialogService.error(
                'Failed to remove item. Please try again.'
              );
            },
          });
        } else {
          console.log('User cancelled removal');
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
