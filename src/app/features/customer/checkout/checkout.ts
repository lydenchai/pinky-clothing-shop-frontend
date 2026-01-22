import { Component, signal, OnInit, AfterViewInit } from "@angular/core";
import { Stripe, StripeElements, StripeCardElement } from "@stripe/stripe-js";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Cart } from "../../../core/types/cart";
import { User } from "../../../core/types/user";
import { OrderSummary } from "../../../core/types/order-summary";
import { CartService } from "../../../core/services/cart.service";
import { AuthService } from "../../../core/services/auth.service";
import { DialogService } from "../../../core/services/dialog.service";
import { OrderService } from "../../../core/services/order.service";

@Component({
  selector: "app-checkout",
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./checkout.html",
  styleUrl: "./checkout.scss",
})
export class Checkout implements OnInit, AfterViewInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  clientSecret: string | null = null;
  cart = signal<Cart | null>(null);
  user = signal<User | null>(null);
  orderPlaced = signal<boolean>(false);
  summaryLoading = signal<boolean>(false);
  summaryError = signal<string | null>(null);
  orderResponse = signal<any>(null);
  orderSummary = signal<OrderSummary | null>(null);

  form = new FormGroup({
    email: new FormControl<string | null>(""),
    first_name: new FormControl<string | null>(""),
    last_name: new FormControl<string | null>(""),
    phone: new FormControl<string | null>(""),
    address: new FormGroup({
      street: new FormControl<string | null>(""),
      house: new FormControl<string | null>(""),
      village: new FormControl<string | null>(""),
      commune: new FormControl<string | null>(""),
      district: new FormControl<string | null>(""),
      province: new FormControl<string | null>(""),
      country: new FormControl<string | null>(""),
    }),
    paymentMethod: new FormControl<string | null>("credit-card"),
    cardNumber: new FormControl<string | null>(""),
    cardExpiry: new FormControl<string | null>(""),
    cardCVC: new FormControl<string | null>(""),
  });

  constructor(
    private readonly translate: TranslateService,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly dialogService: DialogService,
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {
    this.cart.set(this.cartService.cart());
    this.authService.getProfile().subscribe((res: any) => {
      this.user.set(res.data);
      if (res.data) {
        this.form.patchValue({
          email: res.data.email,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          phone: res.data.phone,
          address: {
            street: "",
            house: "",
            village: "",
            commune: "",
            district: "",
            province: "",
            country: res.data.country || "Cambodia",
          },
        });
      }
    });
  }

  ngAfterViewInit(): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  placeOrder() {
    if (
      !this.form.controls.first_name.value ||
      !this.form.controls.last_name.value ||
      !this.form.controls.email.value
    ) {
      this.dialogService.warning(
        this.translate.instant("message.please_fill_in_all_required_fields"),
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
        this.translate.instant("message.please_complete_your_shipping_address"),
      );
      return;
    }

    if (this.form.controls.paymentMethod.value === "credit-card") {
      if (
        !this.form.controls.cardNumber.value ||
        !this.form.controls.cardExpiry.value ||
        !this.form.controls.cardCVC.value
      ) {
        this.dialogService.warning(
          this.translate.instant(
            "message.please_complete_your_payment_information",
          ),
        );
        return;
      }
    }

    // Call backend for order summary/validation
    this.summaryLoading.set(true);
    this.summaryError.set(null);
    const address = this.form.controls.address.value;
    const summaryReq: any = {
      address: {
        house: address.house || "",
        street: address.street || "",
        village: address.village || "",
        commune: address.commune || "",
        district: address.district || "",
        province: address.province || "",
        country: address.country || "",
      },
    };
    this.orderService.getOrderSummary(summaryReq).subscribe({
      next: (summary) => {
        this.orderSummary.set(summary.data);
        this.summaryLoading.set(false);
      },
      error: (err) => {
        this.summaryError.set(
          err?.error?.error ||
            this.translate.instant("message.failed_to_prepare_order_summary"),
        );
        this.summaryLoading.set(false);
      },
    });
  }

  confirmOrder() {
    // Actually place the order after summary confirmation
    const cart = this.cart();
    const user = this.user();
    const address = this.form.controls.address.value;
    const payload: any = {
      items:
        cart?.items?.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          quantity: item.quantity,
          price: item.product_price,
          size: item.size,
          color: item.color,
        })) || [],
      user_id: user?._id || null,
      email: user?.email || this.form.controls.email.value,
      first_name: user?.first_name || this.form.controls.first_name.value,
      last_name: user?.last_name || this.form.controls.last_name.value,
      phone: user?.phone || this.form.controls.phone.value,
      address: {
        house: address.house || "",
        street: address.street || "",
        village: address.village || "",
        commune: address.commune || "",
        district: address.district || "",
        province: address.province || "",
        country: address.country || "",
      },
    };
    this.orderService.create(payload).subscribe({
      next: (order) => {
        this.orderPlaced.set(true);
        this.orderResponse.set(order.data);
        this.dialogService.success(
          this.translate.instant("message.order_placed_successfully"),
          this.translate.instant("message.order_confirmed"),
        );
        this.cartService.clearCart().subscribe({});
        setTimeout(() => {
          this.orderPlaced.set(false);
          this.router.navigate(["/orders"]);
        }, 2000);
      },
      error: () => {
        this.dialogService.error(
          this.translate.instant("message.failed_to_place_order"),
        );
      },
    });
  }
}
