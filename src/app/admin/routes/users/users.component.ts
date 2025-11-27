import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../types/user.model';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { Pagination } from '../../../types/pagination';
import { PaginationComponentUtil } from '../../../utils/pagination-component.util';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum } from '../../../types/enums/role-enum';
import { PluralPipe } from "../../../pipes/plural.pipe";

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule,
    PaginationComponent,
    TranslateModule,
    PluralPipe
],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersAdminComponent
  extends PaginationComponentUtil
  implements OnInit
{
  users: User[] = [];
  pagination: any;
  RoleEnum = RoleEnum;

  constructor(private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.getList({ page: 1, limit: this.limit });
  }

  getList(event: Pagination) {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users;
        this.pagination = res.pagination;
        this.totalCount = res.pagination.totalItems;
        this.limit = event.limit;
        this.page = event.page;
      },
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.getList({ page: this.page, limit: this.limit });
        },
        error: (error) => {
          console.error('Error deleting user', error);
          alert('Failed to delete user');
        },
      });
    }
  }
}
