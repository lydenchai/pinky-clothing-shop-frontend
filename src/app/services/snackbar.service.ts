import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarMessageComponent } from '../components/snackbar-message/snackbar-message.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  private show(
    messageKey: string,
    type: 'success' | 'error' | 'default' | 'warning'
  ) {
    const translated = this.translateService.instant(messageKey);
    const message = translated !== messageKey ? translated : messageKey;
    this.snackBar.openFromComponent(SnackbarMessageComponent, {
      data: { message },
      duration: type !== 'error' ? 3000 : 15000, // 10 seconds for errors
      panelClass: [`panel-${type}`],
    });
  }

  openSnackbarSuccess(messageKey: string) {
    this.show(messageKey, 'success');
  }

  openSnackbarError(messageKey: string) {
    this.show(messageKey, 'error');
  }

  openSnackbarDefault(messageKey: string) {
    this.show(messageKey, 'default');
  }

  openSnackbarWarning(messageKey: string) {
    this.show(messageKey, 'warning');
  }
}
