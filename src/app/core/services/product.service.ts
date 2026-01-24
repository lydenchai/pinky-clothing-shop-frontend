import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import {
  Product,
  ProductFilter,
  ProductsResponse,
} from "../types/product.model";
import { BaseCrudService } from "./base-crud.service";
import { DiscountProduct } from "../types/discount-product";

@Injectable({
  providedIn: "root",
})
export class ProductService extends BaseCrudService<Product> {
  constructor(injector: Injector) {
    super(injector);
    this.path = "/products/";
  }

  getAllProducts(filter?: ProductFilter): Observable<ProductsResponse> {
    const param = this.buildProductFilterParams(filter);
    return this.httpClientService.getJSON<ProductsResponse>(this.path, {
      data: param,
    });
  }

  private buildProductFilterParams(filter?: ProductFilter): any {
    if (!filter) return {};
    const param: any = {};
    const filterKeys: (keyof ProductFilter)[] = [
      "category",
      "subcategory",
      "minPrice",
      "maxPrice",
      "search",
      "inStock",
      "page",
      "limit",
    ];
    filterKeys.forEach((key) => {
      if (filter[key] !== undefined && filter[key] !== null) {
        param[key] = filter[key];
      }
    });
    return param;
  }

  getCategories(): Observable<Product> {
    return this.httpClientService.getJSON<Product>(`${this.path}/categories`, {
      data: {},
    });
  }

  getSubcategories(): Observable<Product> {
    return this.httpClientService.getJSON<Product>(
      `${this.path}/subcategories`,
      {
        data: {},
      },
    );
  }

  bulkSetDiscount(
    productIds: string[],
    discount: {
      discount_type: string;
      discount_value: string;
      discount_start: string;
      discount_end: string;
    },
  ) {
    return this.httpClientService.postJSON<DiscountProduct>(
      `${this.path}/bulk-discount`,
      {
        data: {
          productIds,
          discountType: discount.discount_type,
          discountValue: discount.discount_value,
          discountStart: discount.discount_start,
          discountEnd: discount.discount_end,
        },
      },
    );
  }
}
