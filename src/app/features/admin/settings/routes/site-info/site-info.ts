import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FieldContainer } from '../../../../../shared/components/field-container/field-container';
import { UploadImage } from '../../../../../shared/components/upload-image/upload-image';
import { SiteInfoService } from '../../../../../core/services/site-info.service';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DialogService } from '../../../../../core/services/dialog.service';
@Component({
  selector: 'app-site-info',
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    RouterModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    FieldContainer,
    UploadImage,
    NgxIntlTelInputModule,
  ],
  templateUrl: './site-info.html',
  styleUrl: './site-info.scss',
})
export class SiteInfo {
  isUpdate = signal<boolean>(false);
  imageFile: File | null = null;
  storeLogoPreviewUrl: string | null = null;
  faviconPreviewUrl: string | null = null;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;
  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>(''),
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
    store_logo: new FormControl<string | null>(''),
    favicon: new FormControl<string | null>(''),
    address: new FormControl<string | null>(''),
    facebook: new FormControl<string | null>(''),
    instagram: new FormControl<string | null>(''),
    tik_tok: new FormControl<string | null>(''),
    meta_description: new FormControl<string | null>(''),
  });

  constructor(
    private siteInfoService: SiteInfoService,
    private translate: TranslateService,
    private dialogService: DialogService,
  ) {
    if (!this.isUpdate()) {
      this.form.disable();
    }
    this.fetchSiteInfo();
  }

  fetchSiteInfo() {
    this.siteInfoService.getSiteInfo().subscribe({
      next: (res: any) => {
        this.form.patchValue({
          name: res.data.name,
          description: res.data.description,
          email: res.data.email,
          phone:
            typeof res.data.phone === 'string'
              ? {
                  number: res.data.phone,
                  internationalNumber: res.data.phone,
                  nationalNumber: res.data.phone,
                  e164Number: res.data.phone,
                  countryCode: '',
                  dialCode: '',
                }
              : res.data.phone,
          store_logo: res.data.store_logo,
          favicon: res.data.favicon,
          address: res.data.address,
          facebook: res.data.facebook,
          instagram: res.data.instagram,
          tik_tok: res.data.tik_tok,
          meta_description: res.data.meta_description,
        });
        this.storeLogoPreviewUrl = res.data.store_logo || null;
        this.faviconPreviewUrl = res.data.favicon || null;
      },
    });
  }

  onStoreLogoSelected(file: File | null) {
    this.imageFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.storeLogoPreviewUrl = base64;
        this.form.patchValue({ store_logo: base64 });
      };
      reader.readAsDataURL(file);
    } else {
      this.storeLogoPreviewUrl = null;
      this.form.patchValue({ store_logo: '' });
    }
  }

  onFaviconSelected(file: File | null) {
    this.imageFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.faviconPreviewUrl = base64;
        this.form.patchValue({ favicon: base64 });
      };
      reader.readAsDataURL(file);
    } else {
      this.faviconPreviewUrl = null;
      this.form.patchValue({ favicon: '' });
    }
  }

  onUpdate() {
    this.isUpdate.set(!this.isUpdate());
    if (!this.isUpdate()) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  save() {
    this.isUpdate.set(false);
    this.form.disable();
    const phoneValue = this.form.controls.phone.value;
    const payload = {
      ...this.form.value,
      phone:
        typeof phoneValue === 'object' && phoneValue !== null
          ? phoneValue.e164Number
          : phoneValue,
    } as any;
    this.siteInfoService.updateSiteInfo(payload).subscribe({
      next: () => {
        this.dialogService
          .success(this.translate.instant('message.saved_successfully'))
          .then(() => {
            this.fetchSiteInfo();
          });
      },
      error: () => {
        this.dialogService
          .error(this.translate.instant('message.save_failed'))
          .then(() => {
            this.fetchSiteInfo();
          });
      },
    });
  }
}
