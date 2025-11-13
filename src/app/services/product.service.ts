import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, map } from 'rxjs';
import { Product, ProductFilter, ProductsResponse } from '../types/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = signal<Product[]>([]);
  private categories = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  getAllProducts(filter?: ProductFilter): Observable<ProductsResponse> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.category) params = params.set('category', filter.category);
      if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice.toString());
      if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice.toString());
      if (filter.search) params = params.set('search', filter.search);
      if (filter.inStock !== undefined) params = params.set('inStock', filter.inStock.toString());
      if (filter.page !== undefined) params = params.set('page', filter.page.toString());
      if (filter.limit !== undefined) params = params.set('limit', filter.limit.toString());
    }

    return this.http.get<ProductsResponse>(`${environment.apiUrl}/products`, { params })
      .pipe(
        tap(response => this.products.set(response.products)),
        catchError(error => {
          console.error('Get products error:', error);
          throw error;
        })
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`)
      .pipe(
        catchError(error => {
          console.error('Get product error:', error);
          throw error;
        })
      );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/products/categories`)
      .pipe(
        tap(categories => this.categories.set(categories)),
        catchError(error => {
          console.error('Get categories error:', error);
          throw error;
        })
      );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getAllProducts({ search: query }).pipe(
      map(response => response.products)
    );
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product)
      .pipe(
        catchError(error => {
          console.error('Create product error:', error);
          throw error;
        })
      );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, product)
      .pipe(
        catchError(error => {
          console.error('Update product error:', error);
          throw error;
        })
      );
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/products/${id}`)
      .pipe(
        catchError(error => {
          console.error('Delete product error:', error);
          throw error;
        })
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
    return sizesString ? sizesString.split(',').map(s => s.trim()) : [];
  }

  parseColors(colorsString?: string): string[] {
    return colorsString ? colorsString.split(',').map(c => c.trim()) : [];
  }
}
