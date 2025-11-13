import { Injectable, signal } from '@angular/core';

export interface DialogConfig {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogConfig = signal<DialogConfig | null>(null);
  private resolvePromise: ((value: boolean) => void) | null = null;

  config = this.dialogConfig.asReadonly();

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
  success(message: string, title: string = 'Success') {
    return this.show({ title, message, type: 'success', confirmText: 'OK' });
  }

  error(message: string, title: string = 'Error') {
    return this.show({ title, message, type: 'error', confirmText: 'OK' });
  }

  warning(message: string, title: string = 'Warning') {
    return this.show({ title, message, type: 'warning', confirmText: 'OK' });
  }

  info(message: string, title: string = 'Information') {
    return this.show({ title, message, type: 'info', confirmText: 'OK' });
  }

  ask(message: string, title: string = 'Confirm'): Promise<boolean> {
    return this.show({
      title,
      message,
      type: 'info',
      confirmText: 'Yes',
      cancelText: 'No',
      showCancel: true
    });
  }
}
