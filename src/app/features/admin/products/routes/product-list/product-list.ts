import { Component, OnInit } from "@angular/core";

import { CurrencyPipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Pagination } from "../../../../../shared/components/pagination/pagination";
import { Product } from "../../../../../core/types/product.model";
import { PaginationUtil } from "../../../../../utils/pagination.util";
import { ProductService } from "../../../../../core/services/product.service";
import { DialogService } from "../../../../../core/services/dialog.service";
import { PaginationType } from "../../../../../core/types/pagination-type";
import { FieldContainer } from "../../../../../shared/components/field-container/field-container";
import { MatFormField, MatSelectModule } from "@angular/material/select";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { InputBouncerDirective } from "../../../../../shared/directives/input-bouncer.directive";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.html",
  styleUrls: ["./product-list.scss"],
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
  subcategories: string[] = [];

  form = new FormGroup({
    name: new FormControl<string | null>(""),
    category: new FormControl<string | null>(""),
    subcategory: new FormControl<string | null>(""),
  });
  query?: string;

  constructor(
    private readonly productService: ProductService,
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit() {
    this.getCategories();
    this.getSubcategories();
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
      } else if (res?.data) {
        this.categories = res.data;
      }
    });
  }

  getSubcategories() {
    this.productService.getSubcategories().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.subcategories = res;
      } else if (res?.data) {
        this.subcategories = res.data;
      }
    });
  }

  onCategoryChange(value: string): void {
    this.form.controls.category.setValue(value);
    this.getList({ page: 1, limit: this.limit });
  }

  onSubcategoryChange(value: string): void {
    this.form.controls.subcategory.setValue(value);
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
          "message._are_you_sure_you_want_to_delete_this",
          {
            param: "product",
          },
        ),
        this.translateService.instant("confirm"),
      );
      if (!confirmed) return;
      this.productService.delete(_id).subscribe(() => {
        this.dialogService
          .success(
            this.translateService.instant("message.deleted_successfully"),
          )
          .then(() => {
            this.getList({ page: this.page, limit: this.limit });
          });
      });
    } catch (err) {
      this.dialogService.error(
        this.translateService.instant(
          "message.an_error_occurred_please_try_again",
        ),
      );
      console.error(err);
    }
  }
}
