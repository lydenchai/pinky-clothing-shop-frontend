import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, DialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('pinky-clothing-shop');
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit() {
    // Scroll to top on every navigation
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
      
    // Load cart if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.cartService.loadCart().subscribe({
        error: (error) => console.error('Error loading cart:', error),
      });
    }
  }
}
