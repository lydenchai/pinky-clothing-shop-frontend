import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SiteInfoService } from '../../../../../core/services/site-info.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  isEdit = false;
  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>(''),
    contactEmail: new FormControl<string>('', [
      Validators.required,
      Validators.email,
    ]),
    phone: new FormControl<string>(''),
    address: new FormControl<string>(''),
    logoUrl: new FormControl<string>(''),
  });

  constructor(private siteInfoService: SiteInfoService) {}

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
    this.isEdit = true;
    if (this.info) this.form.patchValue(this.info);
  }

  cancelEdit() {
    this.isEdit = false;
    if (this.info) this.form.patchValue(this.info);
  }

  save() {
    if (this.form.invalid) return;
    this.siteInfoService.updateSiteInfo(this.form.value as any).subscribe({
      next: (info) => {
        this.info = info;
      },
    });
  }
}
