import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../../../services/inventory.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CommonModule } from '@angular/common';
import { PluralPipe } from '../../../../../../pipes/plural.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../../../../components/pagination/pagination.component';
import { MatButtonModule } from '@angular/material/button';
import { PaginationComponentUtil } from '../../../../../../utils/pagination-component.util';
import { Pagination } from '../../../../../../types/pagination';
import { InventoryItem } from '../../../../../../types/inventory-item';

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
    PaginationComponent,
    MatButtonModule,
  ],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent
  extends PaginationComponentUtil
  implements OnInit
{
  inventories: InventoryItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: Pagination) {
    this.loading = true;
    this.inventoryService.getAll(event.page, event.limit).subscribe({
      next: (data) => {
        this.inventories = data?.inventories ?? [];
        this.totalCount = data?.pagination?.totalItems ?? 0;
        this.limit = event.limit;
        this.page = event.page;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load inventory.';
        this.loading = false;
      },
    });
  }

  goToCreate() {
    this.router.navigate(['admin/inventory/new']);
  }

  goToEdit(id: number) {
    this.router.navigate(['admin/inventory', id]);
  }

  deleteItem(id: number) {
    if (!confirm('Are you sure you want to delete this inventory item?'))
      return;
    this.inventoryService.delete(id).subscribe({
      next: () => this.getList({ page: this.page, limit: this.limit }),
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete inventory item.';
      },
    });
  }
}
