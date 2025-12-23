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

  /**
   * Create product with FormData (for file upload)
   */
  createWithFile(data: any, imageFile: File) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.join(','));
      } else if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    if (imageFile) {
      formData.set('image', imageFile, imageFile.name);
    }
    return this.httpClientService.postFile(`${this.path}/create/`, {
      data: formData,
    });
  }

  getAllProducts(filter?: ProductFilter): Observable<ProductsResponse> {
    let param: any = {};
    if (filter) {
      if (filter.category) param.category = filter.category;
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
    return this.httpClientService.getJSON<Product>(
      `${this.path}/categories`,
      {
        data: {},
      }
    );
  }

  /**
   * Create product with FormData (for file upload)
   */
  createWithFormData(formData: FormData) {
    if (typeof (this.httpClientService as any).postFormData === 'function') {
      return (this.httpClientService as any).postFormData(
        this.path + '/create/',
        formData
      );
    } else {
      // fallback for environments where postFormData is not available
      return (this.httpClientService as any).postFile(this.path + '/create/', {
        data: formData,
      });
    }
  }

  /**
   * Update product with FormData (for file upload)
   */
  updateWithFile(id: string, formData: FormData) {
    if (typeof (this.httpClientService as any).postFormData === 'function') {
      return (this.httpClientService as any).postFormData(
        this.path + '/update/' + id,
        formData
      );
    } else {
      // fallback for environments where postFormData is not available
      return (this.httpClientService as any).postFile(
        this.path + '/update/' + id,
        { data: formData }
      );
    }
  }
}
