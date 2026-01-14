import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PluralPipe } from '../../../../../shared/pipes/plural.pipe';
import { MatIconModule } from '@angular/material/icon';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { PaginationUtil } from '../../../../../utils/pagination.util';
import { OrderService } from '../../../../../core/services/order.service';
import { Order } from '../../../../../core/types/order';
import { PaginationType } from '../../../../../core/types/pagination-type';
import { FieldContainer } from '../../../../../shared/components/field-container/field-container';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { InputBouncerDirective } from '../../../../../shared/directives/input-bouncer.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'dd-MM-yyyy',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [
    DatePipe,
    RouterModule,
    TranslateModule,
    MatIconModule,
    Pagination,
    FieldContainer,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    InputBouncerDirective,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class OrdersAdmin extends PaginationUtil implements OnInit {
  orders: Order[] = [];
  form = new FormGroup({
    name: new FormControl<string | null>(''),
    date: new FormControl<Date | null>(new Date()),
  });
  query?: string;

  constructor(private orderService: OrderService) {
    super();
  }

  ngOnInit() {
    this.getList({ page: 1, limit: this.limit });
  }

  onSearch(value: string): void {
    this.query = value;
    this.getList({ page: 1, limit: this.limit });
  }

  onDateChange(value: Date): void {
    this.form.controls.date.setValue(value);
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.orderService
      .getMany({
        page: event.page,
        limit: event.limit,
        q: this.query,
        ...this.form.value,
      })
      .subscribe({
        next: (res) => {
          this.orders = res.data ?? [];
          this.totalCount = res.pagination.totalItems;
          this.limit = event.limit;
          this.page = event.page;
        },
        error: (err) => {
          this.orders = [];
        },
      });
  }
}
