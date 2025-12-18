import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DatePipe, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PluralPipe } from '../../../../../shared/pipes/plural.pipe';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { PaginationUtil } from '../../../../../utils/pagination.util';
import { InventoryItem } from '../../../../../core/types/inventory-item';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { PaginationType } from '../../../../../core/types/pagination-type';
import { FindObjectPipe } from '../../../../../shared/pipes/find-object.pipe';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DatePipe,
    PluralPipe,
    TranslateModule,
    RouterModule,
    Pagination,
    MatButtonModule,
  ],
  templateUrl: './inventory-list.html',
  styleUrls: ['./inventory-list.scss'],
})
export class InventoryList extends PaginationUtil implements OnInit {
  inventories: InventoryItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private inventoryService: InventoryService,
    private router: Router
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

  getList(event: PaginationType) {
    this.inventoryService
      .getMany({
        page: event.page,
        limit: event.limit,
        populate: JSON.stringify({ path: 'product_id' }),
      })
      .subscribe({
        next: (res) => {
          this.inventories = res.data ?? [];
          this.totalCount = res?.pagination?.totalItems ?? 0;
          this.limit = event.limit;
          this.page = event.page;
          this.loading = false;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to load inventory.';
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
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete inventory item.';
      },
    });
  }
}
