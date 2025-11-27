import { Component, OnInit } from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../../services/product.service';
import { Product } from '../../../../../types/product.model';
import { PaginationComponent } from '../../../../../components/pagination/pagination.component';
import { PaginationComponentUtil } from '../../../../../utils/pagination-component.util';
import { Pagination } from '../../../../../types/pagination';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from "../../../../../pipes/plural.pipe";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    PaginationComponent,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    PluralPipe
],
})
export class ProductListComponent
  extends PaginationComponentUtil
  implements OnInit
{
  products: Product[] = [];

  constructor(private productService: ProductService) {
    super();
  }

  ngOnInit() {
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: Pagination) {
    this.productService
      .getAllProducts({ page: event.page, limit: event.limit })
      .subscribe((response) => {
        this.products = response.products;
        this.totalCount = response.pagination.totalItems;
        this.limit = event.limit;
        this.page = event.page;
      });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter((p) => p.id !== id);
      });
    }
  }
}
