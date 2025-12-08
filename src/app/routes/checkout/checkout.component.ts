import { Cart } from '../../types/cart.model';
import { User } from '../../types/user.model';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cart = signal<Cart | null>(null);
  user = signal<User | null>(null);

  form = new FormGroup({
    email: new FormControl<string | null>(''),
    firstName: new FormControl<string | null>(''),
    lastName: new FormControl<string | null>(''),
    phone: new FormControl<string | null>(''),
    address: new FormControl<string | null>(''),
    city: new FormControl<string | null>(''),
    state: new FormControl<string | null>(''),
    postalCode: new FormControl<string | null>(''),
    country: new FormControl<string | null>('Cambodia'),
    paymentMethod: new FormControl<string | null>('credit-card'),
    cardNumber: new FormControl<string | null>(''),
    cardExpiry: new FormControl<string | null>(''),
    cardCVC: new FormControl<string | null>(''),
  });

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
      this.form.patchValue({
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        address: currentUser.address,
        city: currentUser.city,
        postalCode: currentUser.postalCode,
        country: currentUser.country,
      });
    }
  }

  placeOrder() {
    // Validate form
    if (
      !this.form.controls.firstName.value ||
      !this.form.controls.lastName.value ||
      !this.form.controls.email.value
    ) {
      this.dialogService.warning(
        this.translate.instant('message.please_fill_in_all_required_fields')
      );
      return;
    }

    if (
      !this.form.controls.address.value ||
      !this.form.controls.city.value ||
      !this.form.controls.postalCode.value
    ) {
      this.dialogService.warning(
        this.translate.instant('message.please_complete_your_shipping_address')
      );
      return;
    }

    if (this.form.controls.paymentMethod.value === 'credit-card') {
      if (
        !this.form.controls.cardNumber.value ||
        !this.form.controls.cardExpiry.value ||
        !this.form.controls.cardCVC.value
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
      shippingAddress: this.form.controls.address.value,
      shippingCity: this.form.controls.city.value,
      shippingPostalCode: this.form.controls.postalCode.value,
      shippingCountry: this.form.controls.country.value!,
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
      shippingAddress: this.form.controls.address.value,
      shippingCity: this.form.controls.city.value,
      shippingPostalCode: this.form.controls.postalCode.value,
      shippingCountry: this.form.controls.country.value,
    };
    this.orderService.createOrder(orderReq as any).subscribe({
      next: (order) => {
        this.orderPlaced.set(true);
        this.orderResponse = order;
        this.dialogService.success(
          this.translate.instant('message.order_placed_successfully'),
          this.translate.instant('message.order_confirmed')
        );
        this.cartService.clearCart();
        setTimeout(() => {
          this.orderPlaced.set(false);
          this.orderResponse = null;
          // Optionally redirect to home or orders page
          // this.router.navigate(['/']);
        }, 3500);
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
