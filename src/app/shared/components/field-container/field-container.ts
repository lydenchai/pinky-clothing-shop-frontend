import { Component, input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldError } from '../field-error/field-error';
import { Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { IsRequiredPipe } from '../../pipes/is-required$.pipe';

@Component({
  selector: 'app-field-container',
  imports: [MatInputModule, FieldError, IsRequiredPipe, AsyncPipe],
  templateUrl: './field-container.html',
  styleUrl: './field-container.scss',
  host: { class: 'field-container' },
})
export class FieldContainer implements OnDestroy {
  control = input<FormControl>();
  label = input<string>();
  hint = input<string>();
  errorPatternMsg = input<string>();
  private readonly statusChangesSubscription?: Subscription;

  ngOnDestroy() {
    if (this.statusChangesSubscription) {
      this.statusChangesSubscription.unsubscribe();
    }
  }
}
