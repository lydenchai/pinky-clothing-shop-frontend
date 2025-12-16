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
    productId: new FormControl<number | null>(null, Validators.required),
    quantity: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    location: new FormControl<string | null>(''),
  });
  error: string | null = null;
  isEditMode = false;
  itemId = signal<number | null>(null);
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
      this.itemId.set(id ? +id : null);
      if (id) {
        this.isEditMode = true;
        this.inventoryService.getById(id).subscribe({
          next: (res) => {
            this.form.patchValue({
              productId: res.data.productId,
              quantity: res.data.quantity,
              location: res.data.location,
            });
          },
        });
      }
    });
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts({ page: 1, limit: 200 }).subscribe({
      next: (res) => {
        this.products = res.data || [];
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const data = { ...this.form.value } as any;
    const request$ = this.itemId()
      ? this.inventoryService.updateById(String(this.itemId()), data)
      : this.inventoryService.create(data);
    request$.subscribe({
      next: () => {
        this.router.navigate(['/admin/inventory']);
      },
    });
  }
}
