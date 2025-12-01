import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../../../../services/product.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../../../../../services/snackbar.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId?: number;
  loading = false;
  submitted = false;
  backendError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      sizes: [''],
      colors: [''],
    });
  }

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
          stock: product.stock,
          sizes: Array.isArray(product.sizes)
            ? product.sizes.join(', ')
            : product.sizes || '',
          colors: Array.isArray(product.colors)
            ? product.colors.join(', ')
            : product.colors || '',
        });
        this.loading = false;
      },
      error: () => {
        this.snackbarService.openSnackbarError('Failed to load product.');
        this.loading = false;
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    this.backendError = null;
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach((field) => {
        const control = this.productForm.get(field);
        if (control && control.invalid) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      return;
    }

    this.loading = true;
    const formValue = this.productForm.value;
    const productData = {
      ...formValue,
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      category: formValue.category.trim(),
      imageUrl: formValue.imageUrl.trim(),
      sizes: formValue.sizes
        ? formValue.sizes
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => s)
        : [],
      colors: formValue.colors
        ? formValue.colors
            .split(',')
            .map((c: string) => c.trim())
            .filter((c: string) => c)
        : [],
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.snackbarService.openSnackbarSuccess(
            'Product updated successfully.'
          );
        },
        error: () => {
          this.snackbarService.openSnackbarError('Failed to update product.');
          this.loading = false;
        },
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.snackbarService.openSnackbarSuccess(
            'Product created successfully.'
          );
        },
        error: () => {
          this.snackbarService.openSnackbarError('Failed to create product.');
          this.loading = false;
        },
      });
    }
  }
}
