import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  user = signal<any>(null);

  constructor(private readonly authService: AuthService) {
    this.authService.getProfile().subscribe((res: any) => {
      this.user.set(res.data);
    });
  }
}
