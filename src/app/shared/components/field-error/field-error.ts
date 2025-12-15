import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-field-error',
  imports: [MatError, TranslatePipe],
  templateUrl: './field-error.html',
  styleUrl: './field-error.scss',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-50%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class FieldError {
  control = input<FormControl>();
  customMessage = input<{
    required?: string;
    email?: string;
    max?: string;
    min?: string;
    minlength?: string;
    password_unmatch?: string;
    pattern?: string;
  }>({});
  errorPatternMsg = input<string>();
  constructor() {}
}
