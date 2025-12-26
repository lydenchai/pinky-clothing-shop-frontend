import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { DatePipe, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { PaginationUtil } from '../../../../../utils/pagination.util';
import { InventoryItem } from '../../../../../core/types/inventory-item';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { PaginationType } from '../../../../../core/types/pagination-type';
import { InputBouncerDirective } from '../../../../../shared/directives/input-bouncer.directive';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldContainer } from '../../../../../shared/components/field-container/field-container';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DatePipe,
    TranslateModule,
    RouterModule,
    Pagination,
    FieldContainer,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    InputBouncerDirective,
    MatButtonModule,
  ],
  templateUrl: './inventory-list.html',
  styleUrls: ['./inventory-list.scss'],
})
export class InventoryList extends PaginationUtil implements OnInit {
  inventories: InventoryItem[] = [];
  form = new FormGroup({
    name: new FormControl<string | null>(''),
  });
  query?: string;

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
  ) {
    super();
  }

  private routerSub: Subscription | null = null;

  ngOnInit() {
    this.getList({ page: 1, limit: this.limit });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  onSearch(value: string): void {
    this.query = value;
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.inventoryService
      .getMany({
        page: event.page,
        limit: event.limit,
        q: this.query,
        ...this.form.value,
      })
      .subscribe({
        next: (res) => {
          this.inventories = res.data ?? [];
          this.totalCount = res?.pagination?.totalItems ?? 0;
          this.limit = event.limit;
          this.page = event.page;
        },
      });
  }

  goToCreate() {
    this.router.navigate(['admin/inventory/new']);
  }

  goToEdit(_id: string) {
    this.router.navigate(['admin/inventory', _id]);
  }

  deleteItem(_id: string) {
    if (!confirm('Are you sure you want to delete this inventory item?'))
      return;
    this.inventoryService.delete(_id).subscribe({
      next: () => this.getList({ page: this.page, limit: this.limit }),
    });
  }
}
