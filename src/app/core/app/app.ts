import { Component, signal, OnInit } from '@angular/core';
import {
  RouterOutlet,
  Router,
  NavigationEnd,
  NavigationStart,
  NavigationCancel,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { Header } from '../../layouts/customer-layout/header/header';
import { Footer } from '../../layouts/customer-layout/footer/footer';
import { Dialog } from '../../shared/components/dialog/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { LocalStorageService } from '../services/local-storage.service';
import { LoadingService } from '../services/loading.service';
import { LanguageEnum } from '../types/enums/language.enum';
import { LocalStorageEnum } from '../types/enums/local-storage.enum';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    Footer,
    Dialog,
    TranslateModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('pinky-clothing-shop');
  isLoading = signal(false);
  loadingTimeout?: any;
  previousUrl?: string;
  currentUrl?: string;
  showDefaultLayout = signal(true);

  constructor(
    private readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
    public readonly loadingService: LoadingService,
  ) {
    this.translateService.addLangs(Object.values(LanguageEnum));
    const savedLang =
      this.localStorageService.get(LocalStorageEnum.lang) || LanguageEnum.EN;
    this.translateService.use(savedLang);

    // Subscribe to router events for loading state
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.currentUrl = event.url.split('?').reverse().pop();
      }
      if (this.currentUrl && this.currentUrl !== this.previousUrl) {
        if (event instanceof NavigationStart) {
          this.loadingService.forceStop();
          this.loadingService.setLoading(true);
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          this.previousUrl = this.router.url.split('?').reverse().pop();
          setTimeout(() => {
            this.loadingService.setLoading(false);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }, 100);
        }
      }
    });
    // delay to hide some quick loading
    this.loadingService.isLoading$.subscribe((loading) => {
      if (loading) {
        document.body.classList.add('app-is-loading');
      } else {
        document.body.classList.remove('app-is-loading');
      }
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
      this.loadingTimeout = setTimeout(() => {
        this.isLoading.set(loading);
        this.loadingTimeout = undefined;
      }, 200);
    });
  }

  ngOnInit() {
    // Set initial layout visibility to avoid flash on first load
    try {
      // Prefer the browser location (handles direct loads, hash or path-based routing)
      let path = '';
      if (globalThis.window?.location) {
        const { pathname = '', hash = '' } = globalThis.window.location;
        if (hash?.startsWith('#/')) {
          path = hash.substring(1); // remove leading '#'
        } else {
          path = pathname + hash;
        }
      } else {
        path = this.router.url || '/';
      }
      const cleaned = String(path).replace(/^#/, '');
      const isAdminInitial = cleaned.includes('/admin');
      this.showDefaultLayout.set(!isAdminInitial);
      // Toggle body class for CSS fallback
      try {
        if (typeof document !== 'undefined') {
          document.body.classList.toggle('no-global-layout', isAdminInitial);
        }
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      this.showDefaultLayout.set(true);
      console.error(e);
    }

    // Scroll to top on every navigation and toggle layout
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((ev) => {
        // Scroll to top on every navigation
        window.scrollTo(0, 0);

        // Show or hide default header/footer for admin routes.
        // Use both router url and window.location as a fallback (handles hash and direct loads).
        const routerUrl = ev.urlAfterRedirects || this.router.url || '';
        const loc = globalThis.window?.location
          ? (globalThis.window.location.pathname || '') +
            (globalThis.window.location.hash || '')
          : '';
        const cleaned = String(routerUrl || loc).replace(/^#/, '');
        const isAdmin = cleaned.includes('/admin');
        this.showDefaultLayout.set(!isAdmin);
        try {
          if (typeof document !== 'undefined') {
            document.body.classList.toggle('no-global-layout', isAdmin);
          }
        } catch (e) {
          console.error(e);
        }
      });

    // Load cart if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.cartService.getMany().subscribe({
        error: (error) => console.error('Error loading cart:', error),
      });
    }
  }
}
