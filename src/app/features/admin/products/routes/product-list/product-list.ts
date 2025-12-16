import { Component, OnInit } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { PluralPipe } from '../../../../../shared/pipes/plural.pipe';
import { Product } from '../../../../../core/types/product.model';
import { PaginationUtil } from '../../../../../utils/pagination.util';
import { ProductService } from '../../../../../core/services/product.service';
import { DialogService } from '../../../../../core/services/dialog.service';
import { PaginationType } from '../../../../../core/types/pagination-type';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
  imports: [
    RouterModule,
    CurrencyPipe,
    Pagination,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    PluralPipe,
  ],
})
export class ProductList extends PaginationUtil implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private dialogService: DialogService,
    private translateService: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.productService
      .getAllProducts({ page: event.page, limit: event.limit })
      .subscribe((response) => {
        this.products = response.data || [];
        this.totalCount = response.pagination.totalItems;
        this.limit = event.limit;
        this.page = event.page;
      });
  }

  async deleteProduct(id: number) {
    try {
      const confirmed = await this.dialogService.ask(
        this.translateService.instant(
          'message._are_you_sure_you_want_to_delete_this',
          {
            param: 'product',
          }
        ),
        this.translateService.instant('confirm')
      );
      if (!confirmed) return;
      this.productService.delete(String(id)).subscribe(() => {
        this.products = this.products.filter((p) => p.id !== id);
      });
    } catch (err) {
      console.error('Dialog error', err);
    }
  }
}
