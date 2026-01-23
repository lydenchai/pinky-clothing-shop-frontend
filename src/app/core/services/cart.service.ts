import { Injectable, signal, computed, effect, Injector } from "@angular/core";

import { LocalStorageService } from "./local-storage.service";
import { LocalStorageEnum } from "../types/enums/local-storage.enum";
import { Observable, tap, catchError, of } from "rxjs";
import { Cart } from "../types/cart";
import { AuthService } from "./auth.service";
import { CartItem } from "../types/cart-item";
import { CartItemRequest } from "../types/cart-item-request";
import { BaseCrudService } from "./base-crud.service";

@Injectable({
  providedIn: "root",
})
export class CartService extends BaseCrudService<any> {
  private readonly cartItems = signal<CartItem[]>([]);

  cart = computed<Cart>(() => {
    const items = Array.isArray(this.cartItems()) ? this.cartItems() : [];
    const totalItems = items.reduce(
      (sum, item) => sum + (item?.quantity || 0),
      0,
    );
    const subtotal = items.reduce(
      (sum, item) =>
        sum +
        (item.product.discounted_price ?? item.product.price) * item.quantity,
      0,
    );
    let shipping = 0;
    if (subtotal > 0) {
      shipping = subtotal > 100 ? 0 : 10;
    }

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

  public totalItemsInCart = computed(() => this.cart().totalItems ?? 0);

  constructor(
    injector: Injector,
    private readonly auth: AuthService,
    private readonly localStorage: LocalStorageService,
  ) {
    super(injector);
    this.path = "/cart/";

    // React to login/logout using effect on signal
    effect(() => {
      this.auth.user$.subscribe((user) => {
        if (user) {
          // On login: migrate local cart to backend, then clear local
          const savedCart = this.localStorage.get(LocalStorageEnum.Cart);
          if (savedCart) {
            try {
              const items: CartItem[] = JSON.parse(savedCart);
              items.forEach((item: any) => {
                this.addToCart(
                  item.product._id,
                  item.quantity,
                  item.product.sizes,
                  item.product.color,
                ).subscribe();
              });
              this.localStorage.delete(LocalStorageEnum.Cart);
            } catch (e) {
              console.error(e);
            }
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
            } catch (e) {
              console.error(e);
            }
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
          JSON.stringify(this.cartItems()),
        );
      }
    });
  }

  loadCart(): Observable<CartItem[]> {
    return this.httpClientService.getJSON<CartItem[]>(`${this.path}`).pipe(
      tap((res: any) => {
        this.cartItems.set(res.data.items || []);
      }),
      catchError((error) => {
        this.cartItems.set([]);
        return of([]);
      }),
    );
  }

  addToCart(
    product_id: string,
    quantity: number,
    size?: string,
    color?: string,
  ): Observable<CartItem> {
    const request: CartItemRequest = { product_id, quantity, size, color };
    return this.httpClientService
      .postJSON<any>(`${this.path}/add`, { data: request })
      .pipe(
        tap((res) => {
          if (Array.isArray(res?.data?.items)) {
            this.cartItems.set(res.data.items);
          }
        }),
        catchError((error) => {
          throw error;
        }),
      );
  }

  updateQuantity(cartItemId: string, quantity: number): Observable<CartItem> {
    return this.httpClientService
      .patchJSON<CartItem>(`${this.path}/update/${cartItemId}`, {
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
        }),
      );
  }

  removeItem(cartItemId: string): Observable<{ message: string }> {
    return this.httpClientService
      .deleteJSON<{ message: string }>(`${this.path}/delete/${cartItemId}`)
      .pipe(
        tap(() => {
          const items = this.cartItems();
          this.cartItems.set(items.filter((i) => i._id !== cartItemId));
        }),
      );
  }

  clearCart(): Observable<{ message: string }> {
    return this.httpClientService
      .deleteJSON<{ message: string }>(`${this.path}`)
      .pipe(
        tap(() => {
          this.cartItems.set([]);
          this.localStorage.delete(LocalStorageEnum.Cart);
        }),
      );
  }
}
