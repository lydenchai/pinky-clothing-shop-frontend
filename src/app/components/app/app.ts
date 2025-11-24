import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('pinky-clothing-shop');
  // Show default site header/footer/layout. Hidden for admin routes.
  showDefaultLayout = signal(true);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit() {
    // Set initial layout visibility to avoid flash on first load
    try {
      // Prefer the browser location (handles direct loads, hash or path-based routing)
      const path = (typeof window !== 'undefined' && window.location)
        ? (window.location.pathname || '') + (window.location.hash || '')
        : (this.router.url || '/');
      const cleaned = String(path).replace(/^#/, '');
      const isAdminInitial = cleaned.includes('/admin');
      this.showDefaultLayout.set(!isAdminInitial);
      // Toggle body class for CSS fallback
      try {
        if (typeof document !== 'undefined') {
          document.body.classList.toggle('no-global-layout', isAdminInitial);
        }
      } catch (e) {}
    } catch (e) {
      this.showDefaultLayout.set(true);
    }

    // Scroll to top on every navigation and toggle layout
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((ev) => {
        // Scroll to top on every navigation
        window.scrollTo(0, 0);

        // Show or hide default header/footer for admin routes.
        // Use both router url and window.location as a fallback (handles hash and direct loads).
        const routerUrl = (ev as NavigationEnd).urlAfterRedirects || this.router.url || '';
        const loc = (typeof window !== 'undefined' && window.location) ? ((window.location.pathname || '') + (window.location.hash || '')) : '';
        const cleaned = String(routerUrl || loc).replace(/^#/, '');
        const isAdmin = cleaned.includes('/admin');
        // Debug: log navigation and layout decision
        console.debug('[App] navigation:', { routerUrl, loc, cleaned, isAdmin });
        this.showDefaultLayout.set(!isAdmin);
        try {
          if (typeof document !== 'undefined') {
            document.body.classList.toggle('no-global-layout', isAdmin);
          }
        } catch (e) {}
      });

    // Load cart if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.cartService.loadCart().subscribe({
        error: (error) => console.error('Error loading cart:', error),
      });
    }
  }
}
