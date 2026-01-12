import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { STRIPE_PUBLISHABLE_KEY } from '../../../../../../environments/stripe';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-payment',
  imports: [TranslateModule, MatInputModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment {
  stripeKey = STRIPE_PUBLISHABLE_KEY;

  constructor() {}
}
