import { Component, Inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { FieldContainer } from "../../../../../shared/components/field-container/field-container";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { DiscountTypeEnum } from "../../../../../core/types/enums/discount-type.enum";

@Component({
  selector: "app-discount-product-dialog",
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FieldContainer,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: "./discount-product-dialog.html",
  styleUrl: "./discount-product-dialog.scss",
})
export class DiscountProductDialog {
  DiscountTypeEnum = Object.values(DiscountTypeEnum);
  selectedCount = signal<number>(0);

  form = new FormGroup({
    discount_type: new FormControl<DiscountTypeEnum | null>(
      null,
      Validators.required,
    ),
    discount_value: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    discount_start: new FormControl<Date | null>(null, Validators.required),
    discount_end: new FormControl<Date | null>(null, Validators.required),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<DiscountProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.selectedCount.set(data.selectedCount);
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
