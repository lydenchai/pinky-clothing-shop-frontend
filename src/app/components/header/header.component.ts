import {
  Component,
  computed,
  inject,
  HostListener,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { Router } from '@angular/router';
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
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cartItemCount = computed(() => this.cartService.cart().totalItems);
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  user = this.authService.user;
  currentCategory = 'all';
  currentLang = signal<LanguageEnum>(LanguageEnum.EN);
  availableLangs: LanguageEnum[] = [];

  CategoryEnum = CategoryEnum;

  constructor(
    public translateService: TranslateService,
    private localStorageService: LocalStorageService
  ) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const match = url.match(/category=([^&]+)/);
      this.currentCategory = match ? match[1] : 'all';
    });

    const savedLang = localStorageService.get(
      LocalStorageEnum.lang
    ) as LanguageEnum;
    if (savedLang && Object.values(LanguageEnum).includes(savedLang)) {
      this.currentLang.set(savedLang);
      this.translateService.use(savedLang);
    } else {
      this.translateService.use(LanguageEnum.EN);
      this.currentLang.set(LanguageEnum.EN);
    }

    this.translateService.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang as LanguageEnum);
      localStorageService.set(LocalStorageEnum.lang, event.lang);
    });

    // this.availableLangs = this.translateService.getLangs() as LanguageEnum[];
    this.availableLangs = [
      LanguageEnum.EN,
      LanguageEnum.KM,
      LanguageEnum.FR,
      LanguageEnum.CH,
    ];
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentCategory = params['category'] || 'all';
    });
  }

  mobileMenuOpen = false;
  userMenuOpen = false;
  searchModalOpen = false;
  searchQuery = '';
  showSearchInput = false;
  langMenuOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userMenu = target.closest('.user-menu');
    const langMenu = target.closest('.lang-img');
    // Close user menu if clicked outside
    if (!userMenu && this.userMenuOpen) {
      this.userMenuOpen = false;
    }
    // Close language menu if clicked outside
    if (!langMenu && this.langMenuOpen) {
      this.langMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  logout() {
    this.dialogService
      .ask('Are you sure you want to log out?', 'Confirm Logout')
      .then((confirmed) => {
        if (confirmed) {
          this.authService.logout();
          this.dialogService.success('You have been logged out successfully');
        }
      });
  }

  onChangeLanguage(lang: LanguageEnum) {
    this.localStorageService.set(LocalStorageEnum.lang, lang);
    this.translateService.use(lang);
    this.langMenuOpen = false;
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }
}
