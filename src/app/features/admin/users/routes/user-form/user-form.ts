import { Component } from "@angular/core";
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from "@angular/forms";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { RoleEnum } from "../../../../../core/types/enums/role-enum";
import { UserService } from "../../../../../core/services/user.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FieldContainer } from "../../../../../shared/components/field-container/field-container";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
  NgxIntlTelInputModule,
} from "ngx-intl-tel-input";
import { DialogService } from "../../../../../core/services/dialog.service";

@Component({
  selector: "app-user-form",
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FieldContainer,
    MatSelectModule,
    MatIconModule,
    NgxIntlTelInputModule,
  ],
  templateUrl: "./user-form.html",
  styleUrls: ["./user-form.scss"],
})
export class UserForm {
  updateId: string | null = null;
  RoleEnum = Object.values(RoleEnum);
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;
  form = new FormGroup({
    first_name: new FormControl<string | null>("", Validators.required),
    last_name: new FormControl<string | null>("", Validators.required),
    email: new FormControl<string | null>("", [
      Validators.required,
      Validators.email,
    ]),
    phone: new FormControl<
      | string
      | {
          number: string;
          internationalNumber: string;
          nationalNumber: string;
          e164Number: string;
          countryCode: string;
          dialCode: string;
        }
      | null
    >(null),
    role: new FormControl<RoleEnum>(RoleEnum.user, Validators.required),
    password: new FormControl<string | null>("", [
      Validators.required,
      Validators.minLength(6),
    ]),
    address: new FormGroup({
      street: new FormControl<string | null>(""),
      house: new FormControl<string | null>(""),
      village: new FormControl<string | null>(""),
      commune: new FormControl<string | null>(""),
      district: new FormControl<string | null>(""),
      province: new FormControl<string | null>(""),
      country: new FormControl<string | null>(""),
    }),
  });

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly translate: TranslateService,
    private readonly dialogService: DialogService,
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      this.updateId = id;
      if (id) {
        this.userService.getById(id).subscribe({
          next: (res) => {
            const user = res.data;
            if (user) {
              this.form.patchValue({
                first_name: user?.first_name || "",
                last_name: user?.last_name || "",
                email: user?.email || "",
                role: user?.role as any,
                phone:
                  typeof user.phone === "string"
                    ? {
                        number: user.phone,
                        internationalNumber: user.phone,
                        nationalNumber: user.phone,
                        e164Number: user.phone,
                        countryCode: "",
                        dialCode: "",
                      }
                    : user.phone,
                address: {
                  street: user.address?.street || "",
                  house: user.address?.house || "",
                  village: user.address?.village || "",
                  commune: user.address?.commune || "",
                  district: user.address?.district || "",
                  province: user.address?.province || "",
                  country: user.address?.country || "",
                },
              });
            }
          },
        });
      }
    });
  }

  onSubmit() {
    const phoneValue = this.form.controls.phone.value;
    const userData = {
      ...this.form.value,
      phone:
        typeof phoneValue === "object" && phoneValue !== null
          ? phoneValue.e164Number
          : phoneValue,
    } as any;
    if (this.updateId) {
      delete userData.password;
    }
    const request$ = this.updateId
      ? this.userService.updateById(this.updateId, userData)
      : this.userService.create(userData);
    request$.subscribe({
      next: () => {
        this.form.markAsPristine();
        this.dialogService
          .success(this.translate.instant("message.saved_successfully"))
          .then(() => {
            this.router.navigate(["/admin/users"]);
          });
      },
      error: () => {
        this.dialogService
          .error(this.translate.instant("message.save_failed"))
          .then(() => {
            this.router.navigate(["/admin/users"]);
          });
      },
    });
  }
}
