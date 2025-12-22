import { Injectable, signal, computed, effect, Injector } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageEnum } from '../types/enums/local-storage.enum';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Cart } from '../types/cart';
import { AuthService } from './auth.service';
import { CartItem } from '../types/cart-item';
import { CartItemRequest } from '../types/cart-item-request';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class CartService extends BaseCrudService<any> {
  private cartItems = signal<CartItem[]>([]);

  cart = computed<Cart>(() => {
    const items = Array.isArray(this.cartItems()) ? this.cartItems() : [];
    const totalItems = items.reduce(
      (sum, item) => sum + (item?.quantity || 0),
      0
    );
    const subtotal = items.reduce(
      (sum, item) => sum + (item?.product_price ?? 0) * (item?.quantity || 0),
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
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {
    super(injector);
    this.path = '/cart/';

    // React to login/logout using effect on signal
    effect(() => {
      this.auth.user$.subscribe((user) => {
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
          // Load backend cart
          this.loadCart().subscribe();
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

  loadCart(): Observable<CartItem[]> {
    return this.httpClientService
      .getJSON<CartItem[]>(`${this.path}`)
      .pipe(tap((items) => this.cartItems.set(items)));
  }

  addToCart(
    product_id: string,
    quantity: number,
    size?: string,
    color?: string
  ): Observable<CartItem> {
    const request: CartItemRequest = { product_id, quantity, size, color };
    // Use form-data (default .post) instead of JSON for backend compatibility
    return this.httpClientService
      .post<CartItem>(`${this.path}add`, { data: request })
      .pipe(
        tap((item) => {
          const items = this.cartItems();
          // Find existing item by product_id, size, and color
          const existingIndex = items.findIndex(
            (i) =>
              i.product_id === product_id &&
              i.size === size &&
              i.color === color
          );
          if (existingIndex > -1) {
            // Replace existing item with backend response (correct quantity)
            const updated = [...items];
            updated[existingIndex] = item;
            this.cartItems.set(updated);
          } else {
            this.cartItems.set([...items, item]);
          }
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  updateQuantity(cartItemId: string, quantity: number): Observable<CartItem> {
    return this.httpClientService
      .patchJSON<CartItem>(`${this.path}${cartItemId}`, {
        data: { quantity },
      })
      .pipe(
        tap((updatedItem) => {
          const items = this.cartItems();
          const index = items.findIndex((i) => i._id === cartItemId);
          if (index > -1) {
            const updated = [...items];
            updated[index] = updatedItem;
            this.cartItems.set(updated);
          }
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  removeItem(cartItemId: string): Observable<{ message: string }> {
    return this.httpClientService
      .deleteJSON<{ message: string }>(`${this.path}${cartItemId}`)
      .pipe(
        tap(() => {
          const items = this.cartItems();
          this.cartItems.set(items.filter((i) => i._id !== cartItemId));
        })
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
    return this.cart().totalItems!;
  }

  getCachedCart(): Cart {
    return this.cart();
  }
}
