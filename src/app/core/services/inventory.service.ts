import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryItem } from '../types/inventory-item';
import { BaseCrudService } from './base-crud.service';

@Injectable({ providedIn: 'root' })
export class InventoryService extends BaseCrudService<InventoryItem> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/inventory/';
  }

  adjustStock(id: number, amount: number): Observable<InventoryItem> {
    return this.httpClientService.patchJSON<InventoryItem>(
      `${this.path}/${id}/adjust`,
      {
        data: { amount },
      }
    );
  }
}
