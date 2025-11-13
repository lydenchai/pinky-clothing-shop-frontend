import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryEnum } from '../../types/enums/category.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal(true);

  categories = [
    {
      name: 'T-Shirts',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      link: '/products?category=T-Shirts',
    },
    {
      name: 'Jeans',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
      link: '/products?category=Jeans',
    },
    {
      name: 'Dresses',
      image:
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
      link: '/products?category=Dresses',
    },
    {
      name: 'Shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      link: '/products?category=Shoes',
    },
  ];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getAllProducts({ limit: 8 }).subscribe({
      next: (response) => {
        this.products.set(response.products); // Show first 8 products
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Error loading products:', error);
        console.error('Error details:', error.message, error.status);
        this.isLoading.set(false);
      },
    });
  }

  featuredProducts = () => {
    return this.products().slice(0, 4);
  };

  newArrivals = () => {
    return this.products().slice(4, 8);
  };

  CategoryEnum = CategoryEnum;
}
