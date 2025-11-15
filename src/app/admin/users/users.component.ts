import { Component, OnInit } from '@angular/core'; 
import { UserService } from '../../services/user.service';
import { User } from '../../types/user.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersAdminComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
      this.loading = false;
    });
  }
}
