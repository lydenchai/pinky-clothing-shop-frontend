import {
  Component,
  HostListener,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { OrderService } from '../../services/order.service';
import { interval, Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { LocalStorageService } from '../../services/local-storage.service';
import { LanguageEnum } from '../../types/enums/language.enum';
import { LocalStorageEnum } from '../../types/enums/local-storage.enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterModule, TranslateModule, MatIconModule, DatePipe],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  langMenuOpen = false;
  currentLang = signal<LanguageEnum>(LanguageEnum.EN);
  availableLangs: LanguageEnum[] = [
    LanguageEnum.KM,
    LanguageEnum.EN,
    LanguageEnum.FR,
    LanguageEnum.CH,
  ];
  newOrderCount = signal(0);
  newOrders = signal<any[]>([]);
  notificationOpen = signal(false);
  private pollSub?: Subscription;

  constructor(
    public translate: TranslateService,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private orderService: OrderService,
    private router: Router
  ) {
    // Initialise language from local storage
    const savedLang = this.localStorageService.get(
      LocalStorageEnum.lang
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
  }

  ngOnInit() {
    // Poll for new orders every 30 seconds
    this.pollSub = interval(30000).subscribe(() => {
      this.fetchNewOrders();
    });
    // Initial fetch
    this.fetchNewOrders();
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  fetchNewOrders() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        const pendingOrders = orders.filter((o: any) => o.status === 'pending');
        this.newOrderCount.set(pendingOrders.length);
        this.newOrders.set(pendingOrders.slice(0, 5));
      },
      error: () => {
        this.newOrderCount.set(0);
        this.newOrders.set([]);
      },
    });
  }

  toggleNotificationDropdown() {
    this.notificationOpen.set(!this.notificationOpen());
    if (this.notificationOpen()) {
      this.fetchNewOrders();
    }
  }

  goToOrder(orderId: string) {
    this.notificationOpen.set(false);
    this.router.navigate(['/admin/orders', orderId]);
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }

  onChangeLanguage(lang: LanguageEnum) {
    this.localStorageService.set(LocalStorageEnum.lang, lang);
    this.translateService.use(lang);
    this.langMenuOpen = false;
  }

  // Click outside handling
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const langMenu = target.closest('.lang-switcher');
    const notificationDropdown = target.closest('.notification-wrapper');
    if (!langMenu && this.langMenuOpen) {
      this.langMenuOpen = false;
    }
    if (!notificationDropdown && this.notificationOpen()) {
      this.notificationOpen.set(false);
    }
  }
}
