import { Injectable, signal, computed, effect } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageEnum } from '../types/enums/local-storage.enum';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { CartItem, Cart, CartItemRequest } from '../types/cart.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  cart = computed<Cart>(() => {
    const items = this.cartItems();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
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
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {
    // Load cart from local storage on service initialization
    const savedCart = this.localStorage.get(LocalStorageEnum.Cart);
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart);
        this.cartItems.set(items);
      } catch (e) {
        // Ignore parse errors
      }
    }
    // Use effect to persist cartItems changes to local storage
    effect(() => {
      this.localStorage.set(
        LocalStorageEnum.Cart,
        JSON.stringify(this.cartItems())
      );
    });
  }

  loadCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${environment.apiUrl}/cart`).pipe(
      tap((items) => this.cartItems.set(items)),
      catchError((error) => {
        throw error;
      })
    );
  }

  addToCart(
    productId: number,
    quantity: number,
    size?: string,
    color?: string
  ): Observable<CartItem> {
    const request: CartItemRequest = { productId, quantity, size, color };
    return this.http.post<CartItem>(`${environment.apiUrl}/cart`, request).pipe(
      tap((item) => {
        const items = this.cartItems();
        // Find existing item by productId, size, and color
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === productId && i.size === size && i.color === color
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

  updateQuantity(cartItemId: number, quantity: number): Observable<CartItem> {
    return this.http
      .put<CartItem>(`${environment.apiUrl}/cart/${cartItemId}`, { quantity })
      .pipe(
        tap((updatedItem) => {
          const items = this.cartItems();
          const index = items.findIndex((i) => i.id === cartItemId);
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

  removeItem(cartItemId: number): Observable<{ message: string }> {
    const url = `${environment.apiUrl}/cart/${cartItemId}`;
    return this.http.delete<{ message: string }>(url).pipe(
      tap((response) => {
        const items = this.cartItems();
        this.cartItems.set(items.filter((i) => i.id !== cartItemId));
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  clearCart(): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${environment.apiUrl}/cart`)
      .pipe(
        tap(() => {
          this.cartItems.set([]);
          this.localStorage.delete(LocalStorageEnum.Cart);
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  getCartItemCount(): number {
    return this.cart().totalItems;
  }

  getCachedCart(): Cart {
    return this.cart();
  }
}
