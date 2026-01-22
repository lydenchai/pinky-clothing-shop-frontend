import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Product } from "../../../core/types/product.model";
import { WishlistService } from "../../../core/services/wishlist.service";
import { AuthService } from "../../../core/services/auth.service";
import { DialogService } from "../../../core/services/dialog.service";

@Component({
  selector: "app-product-card",
  imports: [CommonModule, RouterLink, TranslateModule, TranslateModule],
  templateUrl: "./product-card.html",
  styleUrl: "./product-card.scss",
})
export class ProductCard {
  @Input() product!: Product;

  @Input() wishlistProductIds: string[] = [];
  @Output() wishlistChanged = new EventEmitter<void>();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly translate: TranslateService,
    private readonly dialogService: DialogService,
    private readonly wishlistService: WishlistService,
  ) {}

  isInWishlist(): boolean {
    return (
      !!this.product._id && this.wishlistProductIds.includes(this.product._id)
    );
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.authService.isAuthenticated()) {
      this.dialogService
        .error(this.translate.instant("message.please_login_to_use_wishlist"))
        .then(() => {
          this.router.navigate(["/login"]);
        });
    }
    if (!this.product._id) return;
    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(this.product._id).subscribe({
        next: () => {
          this.wishlistChanged.emit();
        },
      });
    } else {
      this.wishlistService.addToWishlist(this.product._id).subscribe({
        next: () => {
          this.wishlistChanged.emit();
        },
      });
    }
  }

  getPrice(): string {
    if (
      typeof this.product.discounted_price === "number" &&
      this.product.discounted_price < this.product.price
    ) {
      return this.product.discounted_price.toFixed(2);
    }
    if (typeof this.product.price === "number") {
      return this.product.price.toFixed(2);
    }
    return Number.parseFloat(this.product.price as any).toFixed(2);
  }

  hasDiscount(): boolean {
    return (
      typeof this.product.discounted_price === "number" &&
      this.product.discounted_price < this.product.price
    );
  }
}
