import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/types/product.model';
import { DialogService } from '../../../core/services/dialog.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  quantity = signal<number>(1);
  selectedSize = signal<string>('');
  selectedImage = signal<string>('');
  selectedColor = signal<string>('');
  addedToCart = signal<boolean>(false);
  isWishListed = signal<boolean>(false);
  product = signal<Product | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly translate: TranslateService,
    private readonly dialogService: DialogService,
    private readonly wishlistService: WishlistService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const product_id = params['id'];
      // Fetch wishlist first
      this.wishlistService.getMany().subscribe({
        next: (wishlistRes) => {
          const ids = Array.isArray(wishlistRes.data)
            ? wishlistRes.data.map(
                (item: any) => item.product_id || item._id || item,
              )
            : [];
          // Now fetch product
          this.productService.getById(product_id).subscribe({
            next: (res) => {
              this.product.set(res.data);
              this.selectedImage.set(res.data.image);
              // Set isWishlisted if product is in wishlist
              this.isWishListed.set(ids.includes(res.data._id));
              // Parse sizes and colors from comma-separated strings
              if (res.data.sizes) {
                const sizesArray = res.data.sizes;
                if (sizesArray.length > 0) {
                  this.selectedSize.set(sizesArray[0]);
                }
              }
              if (res.data.colors) {
                const colorsArray = res.data.colors;
                if (colorsArray.length > 0) {
                  this.selectedColor.set(colorsArray[0]);
                }
              }
            },
            error: () => {
              this.router.navigate(['/products']);
            },
          });
        },
        error: () => {
          // If wishlist fetch fails, fallback to product only
          this.productService.getById(product_id).subscribe({
            next: (res) => {
              this.product.set(res.data);
              this.selectedImage.set(res.data.image);
              this.isWishListed.set(false);
            },
            error: () => {
              this.router.navigate(['/products']);
            },
          });
        },
      });
    });
  }

  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  selectColor(colorName: string) {
    this.selectedColor.set(colorName);
  }

  increaseQuantity() {
    this.quantity.update((q) => q + 1);
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart() {
    const prod = this.product();
    if (!prod) return;

    if (!this.selectedSize()) {
      this.dialogService.warning(
        this.translate.instant(
          'message.please_select_a_size_before_adding_to_cart',
        ),
      );
      return;
    }

    if (!this.selectedColor()) {
      this.dialogService.warning(
        this.translate.instant(
          'message.please_select_a_color_before_adding_to_cart',
        ),
      );
      return;
    }

    this.cartService
      .addToCart(
        prod._id!,
        this.quantity(),
        this.selectedSize(),
        this.selectedColor(),
      )
      .subscribe({
        next: () => {
          this.addedToCart.set(true);
          this.dialogService.success(
            this.translate.instant('message.item_added_to_cart_successfully'),
          );
          setTimeout(() => this.addedToCart.set(false), 3000);
        },
        error: (error) => {
          if (error.status === 401) {
            this.dialogService
              .error(
                this.translate.instant(
                  'message.please_login_to_add_items_to_your_cart',
                ),
              )
              .then(() => {
                this.router.navigate(['/login']);
              });
          } else if (error.status === 400) {
            this.dialogService.error(
              error.error?.error ||
                this.translate.instant('message.unable_to_add_item_to_cart'),
            );
          } else {
            this.dialogService
              .error(
                this.translate.instant(
                  'message.please_login_to_add_items_to_your_cart',
                ),
              )
              .then(() => {
                this.router.navigate(['/login']);
              });
            console.error(error);
          }
        },
      });
  }

  getFinalPrice(): number {
    const prod = this.product();
    if (!prod) return 0;
    return prod.price;
  }

  getPrice(): string {
    const prod = this.product();
    if (!prod) return '0.00';
    if (typeof prod.discounted_price === 'number' && prod.discounted_price < prod.price) {
      return prod.discounted_price.toFixed(2);
    }
    if (typeof prod.price === 'number') {
      return prod.price.toFixed(2);
    }
    return Number.parseFloat(prod.price as any).toFixed(2);
  }

  addToWishlist() {
    const prod = this.product();
    if (!prod?._id) return;
    this.wishlistService.addToWishlist(prod._id).subscribe({
      next: () => {
        this.isWishListed.set(true);
        this.dialogService.success(
          this.translate.instant('message.added_to_wishlist'),
        );
      },
      error: (error) => {
        if (error.status === 401) {
          this.dialogService
            .error(
              this.translate.instant(
                'message.please_login_to_add_items_to_your_wishlist',
              ),
            )
            .then(() => {
              this.router.navigate(['/login']);
            });
        } else {
          this.dialogService.error(
            this.translate.instant(
              'message.an_error_occurred_please_try_again',
            ),
          );
        }
      },
    });
  }

  removeFromWishlist() {
    const prod = this.product();
    if (!prod?._id) return;
    this.wishlistService.removeFromWishlist(prod._id).subscribe({
      next: () => {
        this.isWishListed.set(false);
        this.dialogService.success(
          this.translate.instant('message.removed_from_wishlist'),
        );
      },
      error: (error) => {
        this.dialogService.error(
          this.translate.instant('message.an_error_occurred_please_try_again'),
        );
      },
    });
  }
}
