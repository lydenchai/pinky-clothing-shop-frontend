import { Injectable, Injector } from "@angular/core";
import { map, Observable } from "rxjs";
import { InventoryLogItem } from "../types/inventory-log";
import { BaseCrudService } from "./base-crud.service";

@Injectable({ providedIn: "root" })
export class InventoryLogService extends BaseCrudService<InventoryLogItem> {
  constructor(injector: Injector) {
    super(injector);
    this.path = "/inventory/";
  }

  getLogs(inventoryId: string): Observable<InventoryLogItem[]> {
    return this.httpClientService
      .getJSON<{
        data: InventoryLogItem[];
      }>(`${this.path}${inventoryId}/logs`, { data: {} })
      .pipe(map((res) => res.data));
  }
}
