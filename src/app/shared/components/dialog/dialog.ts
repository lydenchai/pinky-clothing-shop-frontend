import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { DialogService } from "../../../core/services/dialog.service";

@Component({
  selector: "app-dialog",
  imports: [CommonModule, TranslateModule],
  templateUrl: "./dialog.html",
  styleUrl: "./dialog.scss",
})
export class Dialog {
  onOverlayKeyDown($event: KeyboardEvent) {
    throw new Error("Method not implemented.");
  }
  config: any = null;

  constructor(private readonly dialogService: DialogService) {
    this.config = this.dialogService.config;
  }

  onConfirm() {
    this.dialogService.confirm(true);
  }

  onCancel() {
    this.dialogService.confirm(false);
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
