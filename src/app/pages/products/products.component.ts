import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import {
  Product,
  ProductFilter,
  PaginationInfo,
} from '../../types/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryEnum } from '../../types/enums/category.enum';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, TranslateModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
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
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(() => {
      // Reset pagination
      this.pagination.set({
        currentPage: 1,
        itemsPerPage: 15,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      // Reset sort
      this.sortBy = 'featured';
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getAllProducts(this.filters()).subscribe({
      next: (response) => {
        let products = response.products;
        // Filter by search query if present
        const search = this.filters().search;
        if (search) {
          const q = search.toLowerCase();
          products = products.filter((p) => p.name.toLowerCase().includes(q));
        }
        this.products.set(products);
        this.pagination.set(response.pagination);
        this.applySort(products);
      },
      error: (error) => {
        throw error;
      },
    });
  }

  setCategory(category: string) {
    const cat = category && category !== '' ? category : undefined;
    this.filters.update((f) => ({ ...f, category: cat, page: 1 }));
    this.loadProducts();
  }

  setPriceRange(min: number, max: number) {
    const minPrice = min > 0 ? min : undefined;
    const maxPrice = max > 0 ? max : undefined;

    // Validate: min should not be greater than max
    if (minPrice && maxPrice && minPrice > maxPrice) {
      return;
    }

    this.filters.update((f) => ({ ...f, minPrice, maxPrice }));
    this.loadProducts();
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
    this.loadProducts();
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
    this.loadProducts();
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
    this.loadProducts();
  }

  onSortChange() {
    this.applySort(this.products());
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.pagination().totalPages) {
      this.filters.update((f) => ({ ...f, page }));
      this.loadProducts();
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
