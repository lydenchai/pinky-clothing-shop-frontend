import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-snackbar-message',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './snackbar-message.html',
  styleUrl: './snackbar-message.scss',
})
export class SnackbarMessage {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
