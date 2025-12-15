import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../../services/user.service';
import { DialogService } from '../../../../../../services/dialog.service';
import { User } from '../../../../../../types/user.model';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PaginationUtil } from '../../../../../../utils/pagination.util';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RoleEnum } from '../../../../../../types/enums/role-enum';
import { PluralPipe } from '../../../../../../pipes/plural.pipe';
import { Pagination } from '../../../../../../components/pagination/pagination';
import { PaginationType } from '../../../../../../types/pagination-type';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule,
    Pagination,
    TranslateModule,
    PluralPipe,
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
})
export class UserList extends PaginationUtil implements OnInit {
  users: User[] = [];
  pagination: any;
  RoleEnum = RoleEnum;

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

  getList(event: PaginationType) {
    this.userService
      .getMany({ page: event.page, limit: event.limit })
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

  async deleteUser(id: number) {
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
