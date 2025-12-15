import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../../../../core/types/product.model';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { ProductService } from '../../../../../core/services/product.service';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './inventory-form.html',
  styleUrls: ['./inventory-form.scss'],
})
export class InventoryForm implements OnInit {
  inventoryForm: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  itemId: number | null = null;
  products: Product[] = [];
  productsLoading = false;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.inventoryForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      location: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.itemId = +id;
        this.fetchItem(this.itemId);
      }
    });
    this.loadProducts();
  }

  loadProducts() {
    this.productsLoading = true;
    // load a reasonable number of products for selection
    this.productService.getAllProducts({ page: 1, limit: 200 }).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.productsLoading = false;
      },
      error: () => {
        this.products = [];
        this.productsLoading = false;
      },
    });
  }

  fetchItem(id: number) {
    this.loading = true;
    this.inventoryService.getById(id).subscribe({
      next: (item) => {
        this.inventoryForm.patchValue(item);
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load inventory item.';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.inventoryForm.invalid) return;
    this.loading = true;
    const raw = this.inventoryForm.value;
    const data = { ...raw, productId: Number(raw.productId) };
    if (this.isEditMode && this.itemId) {
      this.inventoryService.update(this.itemId, data).subscribe({
        next: () => this.router.navigate(['/admin/inventory']),
        error: (err) => {
          this.error =
            err?.error?.message || 'Failed to update inventory item.';
          this.loading = false;
        },
      });
    } else {
      this.inventoryService.create(data).subscribe({
        next: () => this.router.navigate(['/admin/inventory']),
        error: (err) => {
          this.error =
            err?.error?.message || 'Failed to create inventory item.';
          this.loading = false;
        },
      });
    }
  }
}
