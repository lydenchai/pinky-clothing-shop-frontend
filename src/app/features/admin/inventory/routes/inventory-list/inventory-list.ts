import { InventoryLogService } from "../../../../../core/services/inventory-log.service";
import { InventoryLogItem } from "../../../../../core/types/inventory-log";

import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { Subscription } from "rxjs";
import { DatePipe, CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { Pagination } from "../../../../../shared/components/pagination/pagination";
import { PaginationUtil } from "../../../../../utils/pagination.util";
import { InventoryItem } from "../../../../../core/types/inventory-item";
import { InventoryService } from "../../../../../core/services/inventory.service";
import { PaginationType } from "../../../../../core/types/pagination-type";
import { InputBouncerDirective } from "../../../../../shared/directives/input-bouncer.directive";
import { MatFormField, MatSelectModule } from "@angular/material/select";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FieldContainer } from "../../../../../shared/components/field-container/field-container";
import { MatInputModule } from "@angular/material/input";
import { DialogService } from "../../../../../core/services/dialog.service";

@Component({
  selector: "app-inventory-list",
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
  templateUrl: "./inventory-list.html",
  styleUrls: ["./inventory-list.scss"],
})
export class InventoryList extends PaginationUtil implements OnInit, OnDestroy {
  inventories: InventoryItem[] = [];
  form = new FormGroup({
    name: new FormControl<string | null>(""),
  });
  query?: string;
  showLogModal = false;
  logItems: InventoryLogItem[] = [];
  logLoading = false;
  selectedInventoryCode: string | null = null;
  
  constructor(
    private readonly translate: TranslateService,
    private readonly dialogService: DialogService,
    private readonly inventoryService: InventoryService,
    private readonly inventoryLogService: InventoryLogService,
    private readonly router: Router,
  ) {
    super();
  }
  async openLogModal(item: InventoryItem) {
    this.showLogModal = true;
    this.selectedInventoryCode = item.code || null;
    this.logLoading = true;
    this.inventoryLogService.getLogs(item._id).subscribe({
      next: (logs) => {
        this.logItems = logs;
        this.logLoading = false;
      },
      error: () => {
        this.logItems = [];
        this.logLoading = false;
      },
    });
  }

  closeLogModal() {
    this.showLogModal = false;
    this.logItems = [];
    this.selectedInventoryCode = null;
  }

  private readonly routerSub: Subscription | null = null;

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
    this.router.navigate(["admin/inventory/new"]);
  }

  goToEdit(_id: string) {
    this.router.navigate(["admin/inventory", _id]);
  }

  async onDelete(_id: string) {
    try {
      const confirmed = await this.dialogService.ask(
        this.translate.instant(
          "message._are_you_sure_you_want_to_delete_this",
          {
            param: "product",
          },
        ),
        this.translate.instant("confirm"),
      );
      if (!confirmed) return;
      this.inventoryService.delete(_id).subscribe(() => {
        this.dialogService
          .success(this.translate.instant("message.deleted_successfully"))
          .then(() => {
            this.getList({ page: this.page, limit: this.limit });
          });
      });
    } catch (err) {
      this.dialogService.error(
        this.translate.instant("message.an_error_occurred_please_try_again"),
      );
      console.error(err);
    }
  }

  async adjustStock(item: InventoryItem, amount: number) {
    if (!item._id) return;
    try {
      await this.inventoryService.adjustStock(item._id, amount).toPromise();
      this.getList({ page: this.page, limit: this.limit });
    } catch (err) {
      this.dialogService.error(
        this.translate.instant("message.an_error_occurred_please_try_again"),
      );
    }
  }

  async openAdjustDialog(item: InventoryItem) {
    const value = prompt(
      this.translate.instant("Enter adjustment amount (positive or negative):"),
      "0",
    );
    if (value === null) return;
    const amount = parseInt(value, 10);
    if (isNaN(amount) || amount === 0) return;
    await this.adjustStock(item, amount);
  }
}
