import { Cart } from '../../types/cart.model';
import { User } from '../../types/user.model';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { CheckoutForm } from '../../types/product.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderService } from '../../services/order.service';
import { OrderSummary } from '../../types/order-summary';
import { OrderSummaryRequest } from '../../types/order-summary-request';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cart = signal<Cart | null>(null);
  user = signal<User | null>(null);

  checkoutForm: CheckoutForm = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  };

  orderPlaced = signal(false);
  orderSummary: OrderSummary | null = null;
  summaryLoading = false;
  summaryError: string | null = null;
  orderResponse: any = null;

  constructor(
    private translate: TranslateService,
    private cartService: CartService,
    private authService: AuthService,
    private dialogService: DialogService,
    private orderService: OrderService
  ) {
    this.cart.set(this.cartService.cart());
    this.user.set(this.authService.user());
    const currentUser = this.user();
    if (currentUser) {
      this.checkoutForm.email = currentUser.email;
      this.checkoutForm.firstName = currentUser.firstName;
      this.checkoutForm.lastName = currentUser.lastName;
      this.checkoutForm.phone = currentUser.phone || '';
      this.checkoutForm.address = currentUser.address || '';
      this.checkoutForm.city = currentUser.city || '';
      this.checkoutForm.zipCode = currentUser.postalCode || '';
      this.checkoutForm.country = currentUser.country || 'USA';
    }
  }

  placeOrder() {
    // Validate form
    if (
      !this.checkoutForm.firstName ||
      !this.checkoutForm.lastName ||
      !this.checkoutForm.email
    ) {
      this.dialogService.warning(
        this.translate.instant('message.please_fill_in_all_required_fields')
      );
      return;
    }

    if (
      !this.checkoutForm.address ||
      !this.checkoutForm.city ||
      !this.checkoutForm.zipCode
    ) {
      this.dialogService.warning(
        this.translate.instant('message.please_complete_your_shipping_address')
      );
      return;
    }

    if (this.checkoutForm.paymentMethod === 'credit-card') {
      if (
        !this.checkoutForm.cardNumber ||
        !this.checkoutForm.cardExpiry ||
        !this.checkoutForm.cardCVC
      ) {
        this.dialogService.warning(
          this.translate.instant(
            'message.please_complete_your_payment_information'
          )
        );
        return;
      }
    }

    // Call backend for order summary/validation
    this.summaryLoading = true;
    this.summaryError = null;
    const summaryReq: OrderSummaryRequest = {
      shippingAddress: this.checkoutForm.address,
      shippingCity: this.checkoutForm.city,
      shippingPostalCode: this.checkoutForm.zipCode,
      shippingCountry: this.checkoutForm.country,
    };
    this.orderService.getOrderSummary(summaryReq).subscribe({
      next: (summary) => {
        this.orderSummary = summary;
        this.summaryLoading = false;
      },
      error: (err) => {
        this.summaryError =
          err?.error?.error ||
          this.translate.instant('message.failed_to_prepare_order_summary');
        this.summaryLoading = false;
      },
    });
  }

  confirmOrder() {
    // Actually place the order after summary confirmation
    const orderReq = {
      shippingAddress: this.checkoutForm.address,
      shippingCity: this.checkoutForm.city,
      shippingPostalCode: this.checkoutForm.zipCode,
      shippingCountry: this.checkoutForm.country,
    };
    this.orderService.createOrder(orderReq).subscribe({
      next: (order) => {
        this.orderPlaced.set(true);
        this.orderResponse = order;
        this.dialogService.success(
          this.translate.instant('message.order_placed_successfully'),
          this.translate.instant('message.order_confirmed')
        );
        this.cartService.clearCart();
      },
      error: () => {
        this.dialogService.error(
          this.translate.instant('message.failed_to_place_order')
        );
      },
    });
  }

  formatPrice(price: any): string {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  }

  calculateItemTotal(price: any, quantity: number): string {
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return (numPrice * quantity).toFixed(2);
  }
}
