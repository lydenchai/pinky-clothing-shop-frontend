import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';

@Injectable({ providedIn: 'root' })
export class WishlistService extends BaseCrudService<any> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/wishlist';
  }

  addToWishlist(product_id: string): Observable<any> {
    return this.httpClientService.postJSON<any>(`${this.path}/create`, {
      data: { product_id },
    });
  }

  removeFromWishlist(product_id: string): Observable<any> {
    return this.httpClientService.postJSON<any>(`${this.path}/delete`, {
      data: { product_id },
    });
  }
}
