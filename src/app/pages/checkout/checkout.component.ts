import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { CheckoutForm } from '../../types/product.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  cart = this.cartService.cart;
  user = this.authService.user;

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

  constructor(private translate: TranslateService) {
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
      this.dialogService.warning(this.translate.instant('message.please_fill_in_all_required_fields'));
      return;
    }

    if (
      !this.checkoutForm.address ||
      !this.checkoutForm.city ||
      !this.checkoutForm.zipCode
    ) {
      this.dialogService.warning(this.translate.instant('message.please_complete_your_shipping_address'));
      return;
    }

    if (this.checkoutForm.paymentMethod === 'credit-card') {
      if (
        !this.checkoutForm.cardNumber ||
        !this.checkoutForm.cardExpiry ||
        !this.checkoutForm.cardCVC
      ) {
        this.dialogService.warning(this.translate.instant('message.please_complete_your_payment_information'));
        return;
      }
    }

    // In production, this would validate and process the payment
    this.orderPlaced.set(true);

    this.dialogService.success(
      this.translate.instant('message.order_placed_successfully'),
      this.translate.instant('message.order_confirmed')
    );

    setTimeout(() => {
      this.cartService.clearCart();
      this.router.navigate(['/']);
    }, 3000);
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
