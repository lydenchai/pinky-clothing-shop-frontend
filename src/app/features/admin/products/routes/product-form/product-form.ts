import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../../../core/services/product.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { UploadService } from '../../../../../core/services/upload.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PluralPipe } from '../../../../../shared/pipes/plural.pipe';
import { FieldContainer } from '../../../../../shared/components/field-container/field-container';
import { UploadImage } from '../../../../../shared/components/upload-image/upload-image';

@Component({
  selector: 'app-product-form',
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
    PluralPipe,
    UploadImage,
  ],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss'],
})
export class ProductForm implements OnInit {
  imageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  isEditMode = false;
  productId?: number;
  loading = false;
  submitted = false;
  backendError: string | null = null;
  form = new FormGroup({
    name: new FormControl<string | null>('', Validators.required),
    description: new FormControl<string | null>('', Validators.required),
    price: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    category: new FormControl<string | null>('', Validators.required),
    image: new FormControl<string | null>('', Validators.required),
    stock: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    sizes: new FormControl<string | null>(''),
    colors: new FormControl<string | null>(''),
  });

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private uploadService: UploadService,
    private translateService: TranslateService
  ) {}

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
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          stock: product.stock,
          sizes: Array.isArray(product.sizes)
            ? product.sizes.join(', ')
            : product.sizes || '',
          colors: Array.isArray(product.colors)
            ? product.colors.join(', ')
            : product.colors || '',
        });
        this.imagePreviewUrl = product.image || null;
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
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        if (control && control.invalid) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      return;
    }

    this.loading = true;
    const formValue = this.form.value;
    const productData = {
      ...formValue,
      name: (formValue.name ?? '').trim(),
      description: (formValue.description ?? '').trim(),
      category: (formValue.category ?? '').trim(),
      image: (formValue.image ?? '').trim(),
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
    } as any;

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

  onImageSelected(file: File | null) {
    this.imageFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      // Upload to backend
      this.uploadService.uploadImage(file).subscribe({
        next: (res) => {
          this.form.patchValue({ image: res.url });
        },
        error: () => {
          this.snackbarService.openSnackbarError(
            this.translateService.instant('message.image_upload_failed')
          );
          this.form.patchValue({ image: '' });
        },
      });
    } else {
      this.imagePreviewUrl = null;
      this.form.patchValue({ image: '' });
    }
  }
}
