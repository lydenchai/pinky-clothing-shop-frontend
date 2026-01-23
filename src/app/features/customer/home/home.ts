import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ProductCard } from "../../../shared/components/product-card/product-card";
import { Product } from "../../../core/types/product.model";
import { ProductService } from "../../../core/services/product.service";
import { SubcategoryEnum } from "../../../core/types/enums/subcategory.enum";
import { SkeletonLoader } from "../../../shared/components/skeleton-loader/skeleton-loader";

@Component({
  selector: "app-home",
  imports: [
    CommonModule,
    RouterLink,
    ProductCard,
    TranslateModule,
    SkeletonLoader,
  ],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal(true);
  SubCategoryEnum = SubcategoryEnum;

  categories = [
    {
      name: "Shirts",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
      link: "/products?category=Shirts",
    },
    {
      name: "Jeans",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
      link: "/products?category=Jeans",
    },
    {
      name: "Dresses",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
      link: "/products?category=Dresses",
    },
    {
      name: "Shoes",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      link: "/products?category=Shoes",
    },
  ];

  constructor(private readonly productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getMany({ limit: 8 }).subscribe({
      next: (response) => {
        this.products.set(response.data); // Show first 8 products
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
}
