import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../../core/types/product.model';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input() product!: Product;

  @Input() wishlistProductIds: string[] = [];
  @Output() wishlistChanged = new EventEmitter<void>();

  wishlistService = inject(WishlistService);
  authService = inject(AuthService);

  isInWishlist(): boolean {
    return (
      !!this.product._id && this.wishlistProductIds.includes(this.product._id)
    );
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.authService.isAuthenticated()) {
      // Optionally, show a dialog or redirect to login
      window.alert('Please login to use wishlist.');
      return;
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
    if (typeof this.product.price === 'number') {
      return this.product.price.toFixed(2);
    }
    return parseFloat(this.product.price as any).toFixed(2);
  }
}
