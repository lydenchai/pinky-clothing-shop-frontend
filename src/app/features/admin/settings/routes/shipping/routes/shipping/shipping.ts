import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { ShippingService } from '../../../../../../../core/services/shipping.service';
import { ShippingMethod } from '../../../../../../../core/types/shipping-method';
import { Pagination } from '../../../../../../../shared/components/pagination/pagination';
import { PaginationUtil } from '../../../../../../../utils/pagination.util';
import { PaginationType } from '../../../../../../../core/types/pagination-type';
import { RouterModule } from '@angular/router';
import { FieldContainer } from '../../../../../../../shared/components/field-container/field-container';
import { MatSelectModule } from '@angular/material/select';
import { InputBouncerDirective } from '../../../../../../../shared/directives/input-bouncer.directive';
import { DialogService } from '../../../../../../../core/services/dialog.service';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [
    RouterModule,
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
  templateUrl: './shipping.html',
  styleUrl: './shipping.scss',
})
export class Shipping extends PaginationUtil implements OnInit {
  shippingMethods: ShippingMethod[] = [];
  updateId = signal<string | null>(null);
  form = new FormGroup({
    name: new FormControl<string | null>(''),
  });
  query?: string;

  constructor(
    private readonly shippingService: ShippingService,
    private readonly translate: TranslateService,
    private readonly dialogService: DialogService,
  ) {
    super();
  }

  ngOnInit() {
    this.getList({ page: 1, limit: this.limit });
  }

  onSearch(value: string): void {
    this.query = value;
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.shippingService
      .getMany({
        page: event.page,
        limit: event.limit,
        q: this.query,
        ...this.form.value,
      })
      .subscribe({
        next: (res) => {
          this.shippingMethods = res.data;
          this.totalCount = res?.pagination?.totalItems ?? 0;
          this.limit = event.limit;
          this.page = event.page;
        },
      });
  }

  onDelete(id: string) {
    if (!confirm('Delete this shipping method?')) return;
    this.shippingService.delete(id).subscribe({
      next: () => {
        this.dialogService
          .success(this.translate.instant('message.deleted_successfully'))
          .then(() => {
            this.getList({ page: 1, limit: this.limit });
          });
      },
      error: () => {
        this.dialogService.error(
          this.translate.instant('message.delete_failed'),
        );
      },
    });
  }
}
