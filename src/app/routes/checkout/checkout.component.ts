import { Cart } from '../../types/cart';
import { User } from '../../types/user.model';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderService } from '../../services/order.service';
import { OrderSummary } from '../../types/order-summary';
import { OrderSummaryRequest } from '../../types/order-summary-request';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    ReactiveFormsModule,
  ],
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
    address: new FormGroup({
      street: new FormControl<string | null>(''),
      house: new FormControl<string | null>(''),
      village: new FormControl<string | null>(''),
      commune: new FormControl<string | null>(''),
      district: new FormControl<string | null>(''),
      province: new FormControl<string | null>(''),
      country: new FormControl<string | null>('Cambodia'),
    }),
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
    private orderService: OrderService,
    private router: Router
  ) {
    this.cart.set(this.cartService.cart());
    this.authService.user$.subscribe((user) => {
      this.user.set(user);
    });
    this.authService.user$.subscribe((user) => {
      this.user.set(user);
      if (user) {
        this.form.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: {
            street: '',
            house: '',
            village: '',
            commune: '',
            district: '',
            province: '',
            country: user.country || 'Cambodia',
          },
        });
      }
    });
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

    const addressGroup = this.form.controls.address as FormGroup;
    if (
      !addressGroup.value.street ||
      !addressGroup.value.village ||
      !addressGroup.value.commune ||
      !addressGroup.value.district ||
      !addressGroup.value.province
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
    const address = this.form.controls.address.value;
    const summaryReq: any = {
      address: {
        house: address.house || '',
        street: address.street || '',
        village: address.village || '',
        commune: address.commune || '',
        district: address.district || '',
        province: address.province || '',
        country: address.country || 'Cambodia',
      },
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
    const cart = this.cart();
    const user = this.user();
    const address = this.form.controls.address.value;
    const orderReq: any = {
      address: {
        house: address.house || '',
        street: address.street || '',
        village: address.village || '',
        commune: address.commune || '',
        district: address.district || '',
        province: address.province || '',
        country: address.country || 'Cambodia',
      },
      items:
        cart?.items?.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          price: item.productPrice,
          size: item.size,
          color: item.color,
        })) || [],
      userId: user?.id || null,
      email: user?.email || this.form.controls.email.value,
      firstName: user?.firstName || this.form.controls.firstName.value,
      lastName: user?.lastName || this.form.controls.lastName.value,
      phone: user?.phone || this.form.controls.phone.value,
    };
    this.orderService.createOrder(orderReq as any).subscribe({
      next: (order) => {
        this.orderPlaced.set(true);
        this.orderResponse = order;
        this.dialogService.success(
          this.translate.instant('message.order_placed_successfully'),
          this.translate.instant('message.order_confirmed')
        );
        this.cartService.clearCart().subscribe({
          next: () => {
            // Optionally emit an event or use a shared service to notify cart component
          },
        });
        setTimeout(() => {
          this.orderPlaced.set(false);
          // Redirect to order details page if order id exists, else to order history
          if (order?.id) {
            this.router.navigate(['/orders', order.id]);
          } else {
            this.router.navigate(['/orders']);
          }
        }, 2000);
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
