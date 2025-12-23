import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { PluralPipe } from '../../../../../shared/pipes/plural.pipe';
import { PaginationUtil } from '../../../../../utils/pagination.util';
import { User } from '../../../../../core/types/user.model';
import { RoleEnum } from '../../../../../core/types/enums/role-enum';
import { UserService } from '../../../../../core/services/user.service';
import { DialogService } from '../../../../../core/services/dialog.service';
import { PaginationType } from '../../../../../core/types/pagination-type';
import { RouterModule } from '@angular/router';
import { FieldContainer } from '../../../../../shared/components/field-container/field-container';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputBouncerDirective } from '../../../../../shared/directives/input-bouncer.directive';
import { MatFormField, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
  imports: [
    DatePipe,
    MatIconModule,
    Pagination,
    TranslateModule,
    PluralPipe,
    RouterModule,
    FieldContainer,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    InputBouncerDirective,
    MatButtonModule,
  ],
})
export class UserList extends PaginationUtil implements OnInit {
  users: User[] = [];
  pagination: any;
  RoleEnum = RoleEnum;
  form = new FormGroup({
    name: new FormControl<string | null>(''),
    category: new FormControl<string | null>(''),
  });
  query?: string;

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private translateService: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.getList({ page: 1, limit: this.limit });
  }

  onSearch(value: string): void {
    this.query = value;
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: PaginationType) {
    this.userService
      .getMany({
        page: event.page,
        limit: event.limit,
        q: this.query,
        ...this.form.value,
      })
      .subscribe({
        next: (res) => {
          this.users = res.data;
          this.pagination = res.pagination;
          this.totalCount = res.pagination.totalItems;
          this.limit = event.limit;
          this.page = event.page;
        },
      });
  }

  async deleteUser(id: string) {
    try {
      const confirmed = await this.dialogService.ask(
        this.translateService.instant(
          'message._are_you_sure_you_want_to_delete_this',
          {
            param: 'user',
          }
        ),
        this.translateService.instant('confirm')
      );
      if (!confirmed) return;
      this.userService.delete(String(id)).subscribe({
        next: () => {
          this.getList({ page: this.page, limit: this.limit });
        },
      });
    } catch (err) {
      // Handle error if needed
    }
  }
}
