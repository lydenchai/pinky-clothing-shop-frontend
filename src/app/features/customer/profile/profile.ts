import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { AddressPipe } from '../../../shared/pipes/address.pipe';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, TranslateModule, AddressPipe],
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
