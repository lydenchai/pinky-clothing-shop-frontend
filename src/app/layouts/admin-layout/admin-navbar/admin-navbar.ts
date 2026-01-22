import {
  Component,
  HostListener,
  signal,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LocalStorageEnum } from '../../../core/types/enums/local-storage.enum';
import { LanguageEnum } from '../../../core/types/enums/language.enum';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-navbar',
  imports: [
    RouterModule,
    TranslateModule,
    MatIconModule,
    DatePipe,
    MatButtonModule,
  ],
  templateUrl: './admin-navbar.html',
  styleUrls: ['./admin-navbar.scss'],
})
export class AdminNavbar implements OnInit, OnDestroy {
  langMenuOpen = false;
  currentLang = signal<LanguageEnum>(LanguageEnum.EN);
  availableLangs: LanguageEnum[] = [
    LanguageEnum.KM,
    LanguageEnum.EN,
    LanguageEnum.FR,
    LanguageEnum.CH,
    LanguageEnum.VN,
  ];
  newOrderCount = signal(0);
  newOrders = signal<any[]>([]);
  notificationOpen = signal(false);
  private pollSub?: Subscription;
  @Input() menuExtended = false;
  @Output() menuExtendedChange = new EventEmitter<boolean>();

  constructor(
    private readonly translate: TranslateService,
    private readonly translateService: TranslateService,
    private readonly localStorageService: LocalStorageService,
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {
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

  onToggleExtendMenu() {
    this.menuExtended = !this.menuExtended;
    this.menuExtendedChange.emit(this.menuExtended);
  }

  fetchNewOrders() {
    this.orderService.getMany().subscribe({
      next: (orders) => {
        const pendingOrders = orders.data.filter(
          (o: any) => o.status === 'pending',
        );
        // Get viewed order IDs from localStorage
        const viewedIds = this.localStorageService.getArray(
          LocalStorageEnum.AdminViewedOrders,
        );
        // Only show orders not viewed (use _id everywhere)
        const unViewedOrders = pendingOrders.filter(
          (o: any) => !viewedIds.includes(String(o._id)),
        );
        this.newOrderCount.set(unViewedOrders.length);
        this.newOrders.set(unViewedOrders.slice(0, 5));
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

  goToOrder(order_id: string) {
    // Mark as viewed
    const viewedIds = this.localStorageService.getArray(
      LocalStorageEnum.AdminViewedOrders,
    );
    let viewedChanged = false;
    if (!viewedIds.includes(String(order_id))) {
      viewedIds.push(String(order_id));
      this.localStorageService.setArray(
        LocalStorageEnum.AdminViewedOrders,
        viewedIds,
      );
      viewedChanged = true;
    }
    if (viewedChanged) {
      // Remove the just-viewed order from newOrders immediately for UI reactivity
      const updated = this.newOrders().filter(
        (o) => String(o._id) !== String(order_id),
      );
      this.newOrders.set(updated);
    }
    this.notificationOpen.set(false);
    this.fetchNewOrders();
    this.router.navigate(['/admin/orders', order_id]);
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
