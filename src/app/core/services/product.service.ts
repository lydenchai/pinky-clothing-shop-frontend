import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Product,
  ProductFilter,
  ProductsResponse,
} from '../types/product.model';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseCrudService<Product> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/products/';
  }

  getAllProducts(filter?: ProductFilter): Observable<ProductsResponse> {
    let param: any = {};
    if (filter) {
      if (filter.category) param.category = filter.category;
      if (filter.subcategory) param.subcategory = filter.subcategory;
      if (filter.minPrice !== undefined) param.minPrice = filter.minPrice;
      if (filter.maxPrice !== undefined) param.maxPrice = filter.maxPrice;
      if (filter.search) param.search = filter.search;
      if (filter.inStock !== undefined) param.inStock = filter.inStock;
      if (filter.page !== undefined) param.page = filter.page;
      if (filter.limit !== undefined) param.limit = filter.limit;
    }
    return this.httpClientService.getJSON<ProductsResponse>(this.path, {
      data: param,
    });
  }

  getCategories(): Observable<Product> {
    return this.httpClientService.getJSON<Product>(`${this.path}/categories`, {
      data: {},
    });
  }
}
