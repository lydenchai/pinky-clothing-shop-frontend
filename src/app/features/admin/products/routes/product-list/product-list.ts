import { Component, OnInit } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { Product } from '../../../../../core/types/product.model';
import { PaginationUtil } from '../../../../../utils/pagination.util';
import { ProductService } from '../../../../../core/services/product.service';
import { DialogService } from '../../../../../core/services/dialog.service';
import { PaginationType } from '../../../../../core/types/pagination-type';
import { FieldContainer } from '../../../../../shared/components/field-container/field-container';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InputBouncerDirective } from '../../../../../shared/directives/input-bouncer.directive';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
  imports: [
    RouterModule,
    CurrencyPipe,
    Pagination,
    MatIconModule,
    TranslateModule,
    FieldContainer,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    InputBouncerDirective,
    MatButtonModule,
  ],
})
export class ProductList extends PaginationUtil implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  form = new FormGroup({
    name: new FormControl<string | null>(''),
    category: new FormControl<string | null>(''),
  });
  query?: string;

  constructor(
    private productService: ProductService,
    private dialogService: DialogService,
    private translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit() {
    this.getCategories();
    this.getList({ page: 1, limit: this.limit });
  }

  onSearch(value: string): void {
    this.query = value;
    this.getList({ page: 1, limit: this.limit });
  }

  getCategories() {
    this.productService.getCategories().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.categories = res;
      } else if (res && res.data) {
        this.categories = res.data;
      }
    });
  }

  onCategoryChange(value: string): void {
    this.form.controls.category.setValue(value);
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.productService
      .getMany({
        page: event.page,
        limit: event.limit,
        q: this.query,
        ...this.form.value,
      })
      .subscribe((res) => {
        this.products = res.data || [];
        this.totalCount = res.pagination.totalItems;
        this.limit = event.limit;
        this.page = event.page;
      });
  }

  onFilter() {
    this.getList({ page: 1, limit: this.limit });
  }

  async deleteProduct(_id: string) {
    try {
      const confirmed = await this.dialogService.ask(
        this.translateService.instant(
          'message._are_you_sure_you_want_to_delete_this',
          {
            param: 'product',
          },
        ),
        this.translateService.instant('confirm'),
      );
      if (!confirmed) return;
      this.productService.delete(_id).subscribe(() => {
        this.products = this.products.filter((p) => p._id !== _id);
      });
    } catch (err) {
      console.error('Dialog error', err);
    }
  }
}
