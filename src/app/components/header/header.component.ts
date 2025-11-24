import { Component, computed, inject, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { LanguageEnum } from '../../types/enums/language.enum';
import { LocalStorageEnum } from '../../types/enums/local-storage.enum';
import { MatMenuModule } from '@angular/material/menu';
import { CategoryEnum } from '../../types/enums/category.enum';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  // Services
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private localStorageService = inject(LocalStorageService);

  // Signals & state
  cartItemCount = computed(() => this.cartService.cart().totalItems);
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  user = this.authService.user; // signal<User | null>
  currentCategory = signal<string>('all');
  currentLang = signal<LanguageEnum>(LanguageEnum.EN);
  availableLangs: LanguageEnum[] = [LanguageEnum.EN, LanguageEnum.KM, LanguageEnum.FR, LanguageEnum.CH];
  CategoryEnum = CategoryEnum;
  isAdmin = computed(() => {
    const u = this.user();
    return !!u && (u as any).role === 'admin';
  });

  // UI toggles
  mobileMenuOpen = false;
  userMenuOpen = false;
  langMenuOpen = false;
  searchModalOpen = false;
  searchQuery = '';
  showSearchInput = false;

  constructor() {
    // Initialise language from local storage
    const savedLang = this.localStorageService.get(LocalStorageEnum.lang) as LanguageEnum;
    if (savedLang && Object.values(LanguageEnum).includes(savedLang)) {
      this.currentLang.set(savedLang);
      this.translateService.use(savedLang);
    } else {
      this.translateService.use(LanguageEnum.EN);
      this.currentLang.set(LanguageEnum.EN);
    }

    // Listen for language changes
    this.translateService.onLangChange.subscribe(event => {
      this.currentLang.set(event.lang as LanguageEnum);
      this.localStorageService.set(LocalStorageEnum.lang, event.lang);
    });

    // Update current category on navigation
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const match = url.match(/category=([^&]+)/);
      this.currentCategory.set(match ? match[1] : 'all');
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentCategory.set(params['category'] || 'all');
    });
  }

  // Navigation actions
  goToAdminDashboard() {
    this.router.navigate(['/admin']);
    this.closeUserMenu();
  }

  // UI toggle methods
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }

  onChangeLanguage(lang: LanguageEnum) {
    this.localStorageService.set(LocalStorageEnum.lang, lang);
    this.translateService.use(lang);
    this.langMenuOpen = false;
  }

  // Logout
  logout() {
    this.dialogService
      .ask('Are you sure you want to log out?', 'Confirm Logout')
      .then(confirmed => {
        if (confirmed) {
          this.authService.logout();
          this.dialogService.success('You have been logged out successfully');
        }
      });
  }

  // Click outside handling
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userMenu = target.closest('.user-menu');
    const langMenu = target.closest('.lang-img');
    if (!userMenu && this.userMenuOpen) {
      this.userMenuOpen = false;
    }
    if (!langMenu && this.langMenuOpen) {
      this.langMenuOpen = false;
    }
  }
}
