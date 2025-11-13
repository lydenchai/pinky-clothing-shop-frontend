import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { DialogService } from '../../services/dialog.service';
import { Product } from '../../types/product.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | undefined>(undefined);
  selectedImage = signal<string>('');
  selectedSize = signal<string>('');
  selectedColor = signal<string>('');
  quantity = signal<number>(1);
  addedToCart = signal<boolean>(false);

  private dialogService = inject(DialogService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = +params['id'];
      this.productService.getProductById(productId).subscribe({
        next: (foundProduct) => {
          this.product.set(foundProduct);
          this.selectedImage.set(foundProduct.imageUrl);

          // Parse sizes and colors from comma-separated strings
          if (foundProduct.sizes) {
            const sizesArray = foundProduct.sizes
              .split(',')
              .map((s) => s.trim());
            if (sizesArray.length > 0) {
              this.selectedSize.set(sizesArray[0]);
            }
          }

          if (foundProduct.colors) {
            const colorsArray = foundProduct.colors
              .split(',')
              .map((c) => c.trim());
            if (colorsArray.length > 0) {
              this.selectedColor.set(colorsArray[0]);
            }
          }
        },
        error: () => {
          this.router.navigate(['/products']);
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
    if (!prod) {
      console.error('No product loaded');
      return;
    }

    if (!this.selectedSize()) {
      this.dialogService.warning('Please select a size before adding to cart');
      return;
    }

    if (!this.selectedColor()) {
      this.dialogService.warning('Please select a color before adding to cart');
      return;
    }

    this.cartService
      .addToCart(
        prod.id,
        this.quantity(),
        this.selectedSize(),
        this.selectedColor()
      )
      .subscribe({
        next: (item) => {
          this.addedToCart.set(true);
          this.dialogService.success('Item added to cart successfully!');
          setTimeout(() => this.addedToCart.set(false), 3000);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          if (error.status === 401) {
            this.dialogService
              .error('Please login to add items to your cart')
              .then(() => {
                this.router.navigate(['/login']);
              });
          } else if (error.status === 400) {
            this.dialogService.error(
              error.error?.error || 'Unable to add item to cart'
            );
          } else {
            this.dialogService.error('An error occurred. Please try again.');
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
    if (typeof prod.price === 'number') {
      return prod.price.toFixed(2);
    }
    return parseFloat(prod.price as any).toFixed(2);
  }

  getSizesArray(): string[] {
    const prod = this.product();
    if (!prod || !prod.sizes) return [];
    return prod.sizes.split(',').map((s) => s.trim());
  }

  getColorsArray(): string[] {
    const prod = this.product();
    if (!prod || !prod.colors) return [];
    return prod.colors.split(',').map((c) => c.trim());
  }
}
