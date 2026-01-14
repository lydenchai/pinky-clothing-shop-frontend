import { Component, computed, HostListener, signal } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  ActivatedRoute,
  Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../../core/types/user';
import { LanguageEnum } from '../../../core/types/enums/language.enum';
import { CategoryEnum } from '../../../core/types/enums/category.enum';
import { CartService } from '../../../core/services/cart.service';
import { DialogService } from '../../../core/services/dialog.service';
import { AuthService } from '../../../core/services/auth.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LocalStorageEnum } from '../../../core/types/enums/local-storage.enum';

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
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  user = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.user());
  currentCategory = signal<string>('all');
  currentLang = signal<LanguageEnum>(LanguageEnum.EN);
  availableLangs: LanguageEnum[] = [
    LanguageEnum.KM,
    LanguageEnum.EN,
    LanguageEnum.FR,
    LanguageEnum.CH,
    LanguageEnum.VN,
  ];
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

  constructor(
    public cartService: CartService,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
  ) {
    // Keep user signal in sync with AuthService
    this.authService.user$.subscribe((u) => this.user.set(u));

    // Initialize language from local storage
    const savedLang = this.localStorageService.get(
      LocalStorageEnum.lang,
    ) as LanguageEnum;
    if (savedLang && Object.values(LanguageEnum).includes(savedLang)) {
      this.currentLang.set(savedLang);
      this.translateService.use(savedLang);
    } else {
      this.translateService.use(LanguageEnum.EN);
      this.currentLang.set(LanguageEnum.EN);
    }

    // Listen for language changes
    this.translateService.onLangChange.subscribe((event) => {
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
    this.route.queryParams.subscribe((params) => {
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

  onLogout() {
    this.dialogService
      .ask(
        this.translate.instant('message.are_you_sure_you_want_to_log_out'),
        this.translate.instant('message.confirm_logout'),
      )
      .then((confirmed) => {
        if (confirmed) {
          this.authService.logout();
          this.router.navigate(['/']);
          this.dialogService.success(
            this.translate.instant(
              'message.you_have_been_logged_out_successfully',
            ),
          );
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
