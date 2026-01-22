import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from '../../pipes/plural.pipe';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    TranslateModule,
    PluralPipe,
  ],
  templateUrl: './breadcrumb.html',
})
export class Breadcrumb {
  private readonly breadcrumbService = inject(BreadcrumbService);
  breadcrumbs = this.breadcrumbService.breadcrumbs;
}
