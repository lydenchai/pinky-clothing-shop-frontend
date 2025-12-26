import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProductService } from '../../../core/services/product.service';
import { PaginationInfo, Product } from '../../../core/types/product.model';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { PaginationType } from '../../../core/types/pagination-type';
import { PaginationUtil } from '../../../utils/pagination.util';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ProductCard],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist extends PaginationUtil implements OnInit {
  wishlistProducts = signal<Product[]>([]);
  wishlistProductIds = computed(
    () =>
      this.wishlistProducts()
        .map((p) => p._id)
        .filter(Boolean) as string[],
  );
  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
  ) {
    super();
  }

  ngOnInit() {
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.wishlistService.getMany().subscribe({
      next: (res) => {
        const ids = Array.isArray(res.data)
          ? res.data.map((item: any) => item.product_id || item._id || item)
          : [];
        if (ids.length === 0) {
          this.wishlistProducts.set([]);
          return;
        }
        this.productService.getAllProducts().subscribe({
          next: (resp) => {
            const allProducts = resp.data || [];
            // Only set products that are in the wishlist
            const filtered = allProducts.filter((p: any) =>
              ids.includes(p._id),
            );
            this.wishlistProducts.set(filtered);
          },
        });
      },
    });
  }

  onWishlistChanged() {
    this.getList({ page: 1, limit: this.limit });
  }
}
