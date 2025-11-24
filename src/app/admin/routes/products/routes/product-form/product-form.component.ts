import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId?: number;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
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
          sizes: product.sizes,
          colors: product.colors,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product', error);
        this.loading = false;
        // Handle error (e.g., redirect or show notification)
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    const productData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error updating product', error);
          this.loading = false;
        },
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error creating product', error);
          this.loading = false;
        },
      });
    }
  }
}
