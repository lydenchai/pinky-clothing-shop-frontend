import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface DialogConfig {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogConfig = signal<DialogConfig | null>(null);
  private resolvePromise: ((value: boolean) => void) | null = null;

  config = this.dialogConfig.asReadonly();

  constructor(private translate: TranslateService) {}

  show(config: DialogConfig): Promise<boolean> {
    this.dialogConfig.set(config);
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  confirm(resolve: boolean) {
    if (this.resolvePromise) {
      this.resolvePromise(resolve);
      this.resolvePromise = null;
    }
    this.dialogConfig.set(null);
  }

  close() {
    this.confirm(false);
  }

  // Convenience methods
  success(message: string, title: string = 'success') {
    return this.show({
      title: this.translate.instant(title),
      message,
      type: 'success',
      confirmText: this.translate.instant('ok'),
    });
  }

  error(message: string, title: string = 'error') {
    return this.show({
      title: this.translate.instant(title),
      message,
      type: 'error',
      confirmText: this.translate.instant('ok'),
    });
  }

  warning(message: string, title: string = 'warning') {
    return this.show({
      title: this.translate.instant(title),
      message,
      type: 'warning',
      confirmText: this.translate.instant('ok'),
    });
  }

  info(message: string, title: string = 'information') {
    return this.show({
      title: this.translate.instant(title),
      message,
      type: 'info',
      confirmText: this.translate.instant('ok'),
    });
  }

  ask(message: string, title: string = 'confirm'): Promise<boolean> {
    return this.show({
      title: this.translate.instant(title),
      message,
      type: 'info',
      confirmText: this.translate.instant('yes'),
      cancelText: this.translate.instant('no'),
      showCancel: true,
    });
  }
}
