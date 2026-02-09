import { Component, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { Product } from "../../../../../core/types/product.model";
import { InventoryService } from "../../../../../core/services/inventory.service";
import { ProductService } from "../../../../../core/services/product.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FieldContainer } from "../../../../../shared/components/field-container/field-container";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { DialogService } from "../../../../../core/services/dialog.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";

@Component({
  selector: "app-inventory-form",
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FieldContainer,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: "./inventory-form.html",
  styleUrls: ["./inventory-form.scss"],
})
export class InventoryForm implements OnInit {
  form = new FormGroup({
    product_id: new FormControl<string | null>(null, Validators.required),
    quantity: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    location: new FormControl<string | null>(""),
    supplier: new FormControl<string | null>(null),
    expiry_date: new FormControl<Date | null>(null),
  });
  updateId = signal<string | null>(null);
  products: Product[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly translate: TranslateService,
    private readonly dialogService: DialogService,
    private readonly inventoryService: InventoryService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      this.updateId.set(id);
      if (id) {
        this.inventoryService.getById(id).subscribe({
          next: (res) => {
            this.form.patchValue({
              product_id: res.data.product._id || null,
              quantity: res.data.quantity,
              location: res.data.location || "",
              supplier: res.data.supplier || null,
              expiry_date: res.data.expiry_date
                ? new Date(res.data.expiry_date)
                : null,
            });
          },
        });
      }
    });
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getMany({ page: 1, limit: 200 }).subscribe({
      next: (res) => {
        this.products = res.data || [];
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const rawData = { ...this.form.value } as any;
    const request$ = this.updateId()
      ? this.inventoryService.updateById(this.updateId()!, rawData)
      : this.inventoryService.create(rawData);
    request$.subscribe({
      next: () => {
        this.form.markAsPristine();
        this.dialogService
          .success(this.translate.instant("message.saved_successfully"))
          .then(() => {
            this.router.navigate(["/admin/inventory"]);
          });
      },
      error: () => {
        this.dialogService.error(this.translate.instant("message.save_failed"));
      },
    });
  }
}
