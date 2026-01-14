import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FieldContainer } from '../../../../../../../shared/components/field-container/field-container';
import { MatSelectModule } from '@angular/material/select';
import { ShippingService } from '../../../../../../../core/services/shipping.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from '../../../../../../../core/services/dialog.service';

@Component({
  selector: 'app-shipping-form',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FieldContainer,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './shipping-form.html',
  styleUrls: ['./shipping-form.scss'],
})
export class ShippingForm {
  updateId = signal<string | null>(null);
  form = new FormGroup({
    name: new FormControl<string | null>('', Validators.required),
    description: new FormControl<string | null>('', Validators.required),
    price: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    min_order: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    max_order: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0),
    ]),
    country: new FormControl<string | null>('', Validators.required),
    estimated_days: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    active: new FormControl<boolean>(true),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shippingService: ShippingService,
    private translate: TranslateService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.updateId.set(id);
      if (id) {
        this.shippingService.getById(id).subscribe({
          next: (res) => {
            const method = res.data;
            this.form.patchValue({
              name: method.name,
              description: method.description,
              price: method.price,
              min_order: method.min_order,
              max_order: method.max_order,
              country: method.country,
              estimated_days: method.estimated_days,
              active: (method.active ?? 0) ? true : false,
            });
          },
        });
      }
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value as any;
    const request$ = this.updateId()
      ? this.shippingService.updateById(this.updateId()!, formValue)
      : this.shippingService.create(formValue);

    request$.subscribe({
      next: () => {
        this.form.markAsPristine();
        this.dialogService
          .success(this.translate.instant('message.saved_successfully'))
          .then(() => {
            this.router.navigate(['/admin/settings/shipping']);
          });
      },
      error: () => {
        this.dialogService.error(this.translate.instant('message.save_failed'));
      },
    });
  }
}
