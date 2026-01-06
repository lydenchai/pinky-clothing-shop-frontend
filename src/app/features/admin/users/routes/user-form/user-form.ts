import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { RoleEnum } from '../../../../../core/types/enums/role-enum';
import { UserService } from '../../../../../core/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldContainer } from '../../../../../shared/components/field-container/field-container';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss'],
})
export class UserForm {
  updateId: string | null = null;
  RoleEnum = Object.values(RoleEnum);
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;
  form = new FormGroup({
    first_name: new FormControl<string | null>('', Validators.required),
    last_name: new FormControl<string | null>('', Validators.required),
    email: new FormControl<string | null>('', [
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
    password: new FormControl<string | null>('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    postal_code: new FormControl<string | null>(''),
    address: new FormControl<string | null>(''),
    city: new FormControl<string | null>(''),
    country: new FormControl<string | null>(''),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackbarService: SnackbarService,
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.updateId = id;
      if (id) {
        this.userService.getById(id).subscribe({
          next: (res) => {
            const user = res.data;
            if (user) {
              this.form.patchValue({
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                email: user?.email || '',
                role: user?.role as any,
                phone:
                  typeof user.phone === 'string'
                    ? {
                        number: user.phone,
                        internationalNumber: user.phone,
                        nationalNumber: user.phone,
                        e164Number: user.phone,
                        countryCode: '',
                        dialCode: '',
                      }
                    : user.phone,
                address: user?.address || '',
                city: user?.city || '',
                postal_code: user?.postal_code || '',
                country: user?.country || '',
              });
            }
          },
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const phoneValue = this.form.controls.phone.value;
    const userData = {
      ...this.form.value,
      phone:
        typeof phoneValue === 'object' && phoneValue !== null
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
        this.snackbarService.openSnackbarSuccess('message.saved_successfully');
        this.router.navigate(['/admin/users']);
      },
    });
  }
}
