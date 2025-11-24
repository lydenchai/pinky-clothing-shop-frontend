import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../types/user.model';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [DatePipe, MatIconModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersAdminComponent implements OnInit {
  users: User[] = [];
  loading = true;
  pagination: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.users;
        this.pagination = data.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.loading = false;
      },
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user', error);
          alert('Failed to delete user');
        },
      });
    }
  }
}
