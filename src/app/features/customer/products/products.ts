import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { PluralPipe } from '../../../shared/pipes/plural.pipe';
import {
  PaginationInfo,
  Product,
  ProductFilter,
} from '../../../core/types/product.model';
import { CategoryEnum } from '../../../core/types/enums/category.enum';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { PaginationType } from '../../../core/types/pagination-type';
import { PaginationUtil } from '../../../utils/pagination.util';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    FormsModule,
    ProductCard,
    PluralPipe,
    TranslateModule,
    MatSelectModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products extends PaginationUtil implements OnInit, OnDestroy {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  wishlistProductIds = signal<string[]>([]);
  pagination = signal<PaginationInfo>({
    currentPage: 1,
    itemsPerPage: 15,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  filters = signal<ProductFilter>({
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    search: undefined,
    inStock: undefined,
    page: 1,
    limit: 15,
  });

  availableCategories = Object.values(CategoryEnum);

  showFilters = false;
  sortBy = 'featured';
  private priceFilterTimeout: any;

  constructor(
    private readonly productService: ProductService,
    private readonly wishlistService: WishlistService,
    private readonly route: ActivatedRoute,
  ) {
    super();
    // Auto-refresh wishlist on load
    effect(() => {
      this.fetchWishlist();
    });
  }

  fetchWishlist() {
    this.wishlistService.getMany().subscribe({
      next: (res) => {
        // Assume res.data is an array of product ids or wishlist items with product_id
        const ids = Array.isArray(res.data)
          ? res.data.map((item: any) => item.product_id || item._id || item)
          : [];
        this.wishlistProductIds.set(ids.filter(Boolean));
      },
    });
  }

  onWishlistChanged() {
    this.fetchWishlist();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((p: any) => {
      if (p.category === 'all') {
        this.filters.set({
          category: undefined,
        });
      } else {
        this.filters.set({
          category: p['category'],
        });
      }
      this.pagination.set({
        currentPage: 1,
        itemsPerPage: 15,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
      this.sortBy = 'featured';
      this.getList({ page: 1, limit: this.limit });
    });
  }

  onSearchChange(value: string) {
    this.filters.update((f) => ({ ...f, search: value, page: 1 }));
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.productService
      .getAllProducts({
        page: event.page,
        limit: event.limit,
        ...this.filters(),
      })
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          this.applySort(res.data);
          if (res.pagination) {
            this.pagination.set({
              currentPage: event.page,
              itemsPerPage: event.limit,
              totalItems: res.pagination.totalItems,
              totalPages: res.pagination.totalPages,
              hasNextPage: event.page < res.pagination.totalPages,
              hasPreviousPage: event.page > 1,
            });
          }
        },
      });
  }

  setCategory(category: string) {
    const cat = category && category !== '' ? category : undefined;
    this.filters.update((f) => ({ ...f, category: cat, page: 1 }));
    this.getList({ page: 1, limit: this.limit });
  }

  setPriceRange(min: number, max: number) {
    const minPrice = min > 0 ? min : undefined;
    const maxPrice = max > 0 ? max : undefined;

    // Validate: min should not be greater than max
    if (minPrice && maxPrice && minPrice > maxPrice) {
      return;
    }

    this.filters.update((f) => ({ ...f, minPrice, maxPrice }));
    this.getList({ page: 1, limit: this.limit });
  }

  onMinPriceChange(value: string) {
    // Clear existing timeout
    if (this.priceFilterTimeout) {
      clearTimeout(this.priceFilterTimeout);
    }

    // Debounce the filter update
    this.priceFilterTimeout = setTimeout(() => {
      const min =
        value && !Number.isNaN(Number.parseFloat(value))
          ? Number.parseFloat(value)
          : 0;
      const max = this.filters().maxPrice || 0;
      this.setPriceRange(min, max);
    }, 500);
  }

  onMaxPriceChange(value: string) {
    // Clear existing timeout
    if (this.priceFilterTimeout) {
      clearTimeout(this.priceFilterTimeout);
    }

    // Debounce the filter update
    this.priceFilterTimeout = setTimeout(() => {
      const min = this.filters().minPrice || 0;
      const max =
        value && !Number.isNaN(Number.parseFloat(value))
          ? Number.parseFloat(value)
          : 0;
      this.setPriceRange(min, max);
    }, 500);
  }

  toggleInStock() {
    this.filters.update((f) => ({ ...f, inStock: !f.inStock }));
    this.getList({ page: 1, limit: this.limit });
  }

  applySort(products: Product[]) {
    let sorted = [...products];

    // Apply sorting
    switch (this.sortBy) {
      case 'price-low':
        sorted.sort((a: Product, b: Product) => {
          const priceA =
            typeof a.price === 'number'
              ? a.price
              : Number.parseFloat(a.price as any);
          const priceB =
            typeof b.price === 'number'
              ? b.price
              : Number.parseFloat(b.price as any);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sorted.sort((a: Product, b: Product) => {
          const priceA =
            typeof a.price === 'number'
              ? a.price
              : Number.parseFloat(a.price as any);
          const priceB =
            typeof b.price === 'number'
              ? b.price
              : Number.parseFloat(b.price as any);
          return priceB - priceA;
        });
        break;
      case 'name':
        sorted.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Keep original order for featured
        break;
    }

    // Always set filteredProducts, even if empty
    this.filteredProducts.set(sorted);
  }

  applyFilters() {
    this.getList({ page: 1, limit: this.limit });
  }

  clearFilters() {
    this.filters.set({
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      search: undefined,
      inStock: undefined,
      page: 1,
      limit: 15,
    });
    this.getList({ page: 1, limit: this.limit });
  }

  onSortChange(value: string) {
    this.sortBy = value;
    this.applySort(this.products());
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.pagination().totalPages) {
      this.filters.update((f) => ({ ...f, page }));
      this.getList({ page, limit: this.limit });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage() {
    if (this.pagination().hasNextPage) {
      this.goToPage(this.pagination().currentPage + 1);
    }
  }

  previousPage() {
    if (this.pagination().hasPreviousPage) {
      this.goToPage(this.pagination().currentPage - 1);
    }
  }

  ngOnDestroy() {
    if (this.priceFilterTimeout) {
      clearTimeout(this.priceFilterTimeout);
    }
  }

  CategoryEnum = CategoryEnum;
}
