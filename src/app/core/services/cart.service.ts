import { Injectable, signal, computed, effect, Injector } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { CartItem } from '../types/cart-item';
import { Cart } from '../types/cart';
import { LocalStorageEnum } from '../types/enums/local-storage.enum';
import { CartItemRequest } from '../types/cart-item-request';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class CartService extends BaseCrudService<any> {
  private cartItems = signal<any[]>([]);

  cart = computed<any>(() => {
    const itemsRaw = this.cartItems();
    const items = Array.isArray(itemsRaw) ? itemsRaw : [];
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + (item.product_price ?? 0) * item.quantity,
      0
    );
    const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      items,
      totalItems,
      subtotal,
      shipping,
      tax,
      total,
    };
  });

  constructor(
    injector: Injector,
    private auth: AuthService,
    private localStorage: LocalStorageService
  ) {
    super(injector);
    this.path = '/cart/';

    // React to login/logout using effect on signal
    effect(() => {
      this.auth.getProfile().subscribe((user) => {
        if (user) {
          // On login: migrate local cart to backend, then clear local
          const savedCart = this.localStorage.get(LocalStorageEnum.Cart);
          if (savedCart) {
            try {
              const items: CartItem[] = JSON.parse(savedCart);
              items.forEach((item) => {
                this.addToCart(
                  item.product_id!,
                  item.quantity,
                  item.size,
                  item.color
                ).subscribe();
              });
              this.localStorage.delete(LocalStorageEnum.Cart);
            } catch (e) {}
          }
        } else {
          // On logout: clear cart and localStorage
          this.cartItems.set([]);
          this.localStorage.delete(LocalStorageEnum.Cart);
          // On service init for guest: load cart from localStorage
          const savedCart = this.localStorage.get(LocalStorageEnum.Cart);
          if (savedCart) {
            try {
              const items: CartItem[] = JSON.parse(savedCart);
              this.cartItems.set(items);
            } catch (e) {}
          }
        }
      });
    });

    // Persist cart changes to correct place
    effect(() => {
      if (this.auth.userSubject.value) {
        // Optionally, sync to backend here if needed
        // (Backend is already updated on add/update/remove)
      } else {
        this.localStorage.set(
          LocalStorageEnum.Cart,
          JSON.stringify(this.cartItems())
        );
      }
    });
  }

  addToCart(
    product_id: string,
    quantity: number,
    size?: string,
    color?: string
  ): Observable<{ data: any[]; message: string }> {
    const payload: CartItemRequest = { product_id, quantity, size, color };
    return this.httpClientService
      .postJSON<{ data: any[]; message: string }>(`${this.path}/add`, {
        data: payload,
      })
      .pipe(
        tap((response) => {
          if (Array.isArray(response.data)) {
            this.cartItems.set(response.data);
          }
        })
      );
  }

  updateQuantity(cart_item_id: string, quantity: number): Observable<CartItem> {
    return this.httpClientService
      .patchJSON<CartItem>(`${this.path}update/${cart_item_id}`, {
        data: { quantity },
      })
      .pipe(
        tap((updatedItem) => {
          const items = this.cartItems();
          const index = items.findIndex((i) => i._id === cart_item_id);
          if (index > -1) {
            const updated = [...items];
            updated[index] = updatedItem;
            this.cartItems.set(updated);
          }
        })
      );
  }

  removeItem(cart_item_id: string): Observable<{ message: string }> {
    return this.httpClientService.deleteJSON<any>(
      `${this.path}delete/${cart_item_id}`
    );
  }

  clearCart(): Observable<{ message: string }> {
    return this.httpClientService
      .deleteJSON<{ message: string }>(`${this.path}`)
      .pipe(
        tap(() => {
          this.cartItems.set([]);
          this.localStorage.delete(LocalStorageEnum.Cart);
        })
      );
  }

  getCartItemCount(): number {
    const cart = this.cart();
    return cart && typeof cart.totalItems === 'number' ? cart.totalItems : 0;
  }

  getCachedCart(): Cart {
    return this.cart();
  }
}
