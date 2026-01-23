import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CartService } from "../../../core/services/cart.service";
import { DialogService } from "../../../core/services/dialog.service";
import { Cart as CartInterface } from "../../../core/types/cart";

@Component({
  selector: "app-cart",
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: "./cart.html",
  styleUrl: "./cart.scss",
})
export class Cart {
  cart = signal<CartInterface | null>(null);

  constructor(
    private readonly cartService: CartService,
    private readonly translate: TranslateService,
    private readonly dialogService: DialogService,
  ) {
    this.fetchCart();
  }

  fetchCart() {
    this.cartService.loadCart().subscribe((cart: any) => {
      this.cart.set(cart.data);
    });
  }

  removeItem(cartItemId: string) {
    this.dialogService
      .ask(
        this.translate.instant("message.are_you_sure_remove_item"),
        this.translate.instant("message.remove_item"),
      )
      .then((confirmed) => {
        if (confirmed) {
          this.cartService.removeItem(cartItemId).subscribe({
            next: () => {
              this.dialogService.success(
                this.translate.instant("message.item_removed_from_cart"),
              );
              this.fetchCart();
            },
          });
        }
      });
  }

  increaseQuantity(index: number) {
    const cart = this.cart();
    const item = cart?.items?.[index];
    if (!item?._id) {
      return;
    }
    this.updateQuantity(item._id, item.quantity + 1);
  }

  decreaseQuantity(index: number) {
    const cart = this.cart();
    if (!cart) {
      return;
    }
    const item = cart?.items?.[index];
    if (item && item.quantity > 1 && item._id) {
      this.updateQuantity(item._id, item.quantity - 1);
    }
  }

  updateQuantity(cartItemId: string, quantity: number) {
    this.cartService.updateQuantity(cartItemId, quantity).subscribe({
      next: () => {
        this.fetchCart();
      },
      error: (error) => {
        this.dialogService.error(
          error
            ? error.error
            : this.translate.instant("message.failed_to_update_quantity"),
        );
      },
    });
  }
}
