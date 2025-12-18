// Helper to generate MongoDB-style ObjectId
function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return timestamp + random;
}
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../../../core/types/product.model';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { ProductService } from '../../../../../core/services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FieldContainer } from '../../../../../shared/components/field-container/field-container';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Inventory } from '../../../../../core/types/inventory';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
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
  ],
  templateUrl: './inventory-form.html',
  styleUrls: ['./inventory-form.scss'],
})
export class InventoryForm implements OnInit {
  form = new FormGroup({
    product_id: new FormControl<string | null>(null, Validators.required),
    quantity: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    location: new FormControl<string | null>(''),
  });
  isEditMode = false;
  itemId = signal<string | null>(null);
  products: Product[] = [];

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.itemId.set(id);
      if (id) {
        this.isEditMode = true;
        this.inventoryService.getById(id).subscribe({
          next: (res) => {
            this.form.patchValue({
              product_id: res.data.product_id || null,
              quantity: res.data.quantity,
              location: res.data.location || '',
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
    if (this.form.invalid) return;
    const rawData = { ...this.form.value } as any;
    const request$ = this.itemId()
      ? this.inventoryService.updateById(this.itemId()!, rawData)
      : this.inventoryService.create(rawData);
    request$.subscribe({
      next: () => {
        this.router.navigate(['/admin/inventory']);
      },
    });
  }
}
