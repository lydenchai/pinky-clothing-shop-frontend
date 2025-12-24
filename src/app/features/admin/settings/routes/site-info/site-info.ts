import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SiteInfoService } from '../../../../../core/services/site-info.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SiteInformation } from '../../../../../core/types/site-info';

@Component({
  selector: 'app-site-info',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './site-info.html',
  styleUrls: ['./site-info.scss'],
})
export class SiteInfo implements OnInit {
  info: SiteInformation | null = null;
  editMode = false;
  form: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private siteInfoService: SiteInfoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', { nonNullable: true }],
      description: [''],
      contactEmail: ['', { nonNullable: true }],
      phone: [''],
      address: [''],
      logoUrl: [''],
    });
  }

  ngOnInit() {
    this.loadInfo();
  }

  loadInfo() {
    this.siteInfoService.getSiteInfo().subscribe((info) => {
      this.info = info;
      this.form.patchValue(info);
    });
  }

  enableEdit() {
    this.editMode = true;
    this.successMsg = '';
    this.errorMsg = '';
    if (this.info) this.form.patchValue(this.info);
  }

  cancelEdit() {
    this.editMode = false;
    this.successMsg = '';
    this.errorMsg = '';
    if (this.info) this.form.patchValue(this.info);
  }

  save() {
    if (this.form.invalid) {
      this.errorMsg = 'Please fill all required fields.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.siteInfoService.updateSiteInfo(this.form.value).subscribe({
      next: (info) => {
        this.info = info;
        this.editMode = false;
        this.successMsg = 'Site info updated!';
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to update site info.';
        this.loading = false;
      },
    });
  }
}
