import { Component, OnInit, OnDestroy, signal } from '@angular/core';
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
import { PaginationType } from '../../../core/types/pagination-type';
import { PaginationUtil } from '../../../utils/pagination.util';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCard,
    TranslateModule,
    PluralPipe,
    MatSelectModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products extends PaginationUtil implements OnInit, OnDestroy {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
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
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(() => {
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

  getList(event: PaginationType) {
    this.productService
      .getAllProducts({
        ...this.filters(),
        page: event.page,
        limit: event.limit,
      })
      .subscribe({
        next: (res) => {
          // Set products and filteredProducts
          this.products.set(res.data);
          this.applySort(res.data);
          // Update pagination info from backend
          if (res.pagination) {
            // Map backend keys to frontend expected keys
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
      const min = value && !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
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
      const max = value && !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
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
            typeof a.price === 'number' ? a.price : parseFloat(a.price as any);
          const priceB =
            typeof b.price === 'number' ? b.price : parseFloat(b.price as any);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sorted.sort((a: Product, b: Product) => {
          const priceA =
            typeof a.price === 'number' ? a.price : parseFloat(a.price as any);
          const priceB =
            typeof b.price === 'number' ? b.price : parseFloat(b.price as any);
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

  toggleFilters() {
    this.showFilters = !this.showFilters;
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
