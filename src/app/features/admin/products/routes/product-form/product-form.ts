import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { SizeEnum } from '../../../../../core/types/enums/size.enum';
import { MatSelectModule } from '@angular/material/select';
import { MainCategoryEnum } from '../../../../../core/types/enums/main-category.enum';

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
    MatSelectModule,
  ],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss'],
})
export class ProductForm implements OnInit {
  imageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  isEditMode = false;
  updateId = signal<string | null>(null);
  backendError: string | null = null;
  MainCategoryEnum = Object.values(MainCategoryEnum);
  SizeEnum = Object.values(SizeEnum);
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
    sizes: new FormControl<string[] | null>([], Validators.required),
    colors: new FormControl<string | null>(''),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.updateId.set(id);
      this.isEditMode = true;
      this.loadProduct(this.updateId()!);
    });
    // this.product_id = this.route.snapshot.paramMap.get('id');
    // if (this.product_id) {
    // }
  }

  loadProduct(_id: string) {
    this.productService.getById(_id).subscribe({
      next: (res) => {
        const product = res.data;
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          stock: product.stock,
          sizes: Array.isArray(product.sizes)
            ? product.sizes
            : typeof product.sizes === 'string' && product.sizes
            ? product.sizes.split(',').map((s: string) => s.trim())
            : [],
          colors: Array.isArray(product.colors)
            ? product.colors.join(', ')
            : product.colors || '',
        });
        this.imagePreviewUrl = product.image || null;
      },
    });
  }

  onSave() {
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

    const formValue = this.form.value;
    const productData = {
      ...formValue,
      name: (formValue.name ?? '').trim(),
      description: (formValue.description ?? '').trim(),
      category: (formValue.category ?? '').trim(),
      image: (formValue.image ?? '').trim(),
      sizes: formValue.sizes ?? [],
      colors: formValue.colors
        ? formValue.colors
            .split(',')
            .map((c: string) => c.trim())
            .filter((c: string) => c)
        : [],
    } as any;

    const request$ = this.isEditMode
      ? this.productService.updateById(this.updateId()!, productData)
      : this.productService.create(productData);
    request$.subscribe({
      next: () => {
        this.form.markAsPristine();
        this.snackbarService.openSnackbarSuccess('message.saved_successfully');
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        this.backendError =
          error?.error?.message || 'An error occurred. Please try again.';
      },
    });
  }

  onImageSelected(file: File | null) {
    this.imageFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.imagePreviewUrl = base64;
        this.form.patchValue({ image: base64 });
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreviewUrl = null;
      this.form.patchValue({ image: '' });
    }
  }
}
