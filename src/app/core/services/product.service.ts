import { Injectable, Injector, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, map } from 'rxjs';
import {
  Product,
  ProductFilter,
  ProductsResponse,
} from '../types/product.model';
import { BaseCrudService } from './base-crud.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseCrudService<Product> {
  private products = signal<Product[]>([]);
  private categories = signal<string[]>([]);

  constructor(injector: Injector, private http: HttpClient) {
    super(injector);
    this.path = '/products/';
  }

  getAllProducts(filter?: ProductFilter): Observable<ProductsResponse> {
    let params = new HttpParams();

    if (filter) {
      if (filter.category) params = params.set('category', filter.category);
      if (filter.minPrice !== undefined)
        params = params.set('minPrice', filter.minPrice.toString());
      if (filter.maxPrice !== undefined)
        params = params.set('maxPrice', filter.maxPrice.toString());
      if (filter.search) params = params.set('search', filter.search);
      if (filter.inStock !== undefined)
        params = params.set('inStock', filter.inStock.toString());
      if (filter.page !== undefined)
        params = params.set('page', filter.page.toString());
      if (filter.limit !== undefined)
        params = params.set('limit', filter.limit.toString());
    }

    return this.http
      .get<ProductsResponse>(`${environment.apiUrl}/products`, { params })
      .pipe(
        tap((response) => this.products.set(response.data)),
        catchError((error) => {
          throw error;
        })
      );
  }

  getCategories(): Observable<Product> {
    return this.httpClientService.patchJSON<Product>(
      `${this.path}/categories`,
      {
        data: {},
      }
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getAllProducts({ search: query }).pipe(
      map((response) => response.data)
    );
  }

  // Helper methods
  getCachedProducts(): Product[] {
    return this.products();
  }

  getCachedCategories(): string[] {
    return this.categories();
  }

  // Utility to parse sizes and colors from backend strings
  parseSizes(sizesString?: string): string[] {
    return sizesString ? sizesString.split(',').map((s) => s.trim()) : [];
  }

  parseColors(colorsString?: string): string[] {
    return colorsString ? colorsString.split(',').map((c) => c.trim()) : [];
  }
}
