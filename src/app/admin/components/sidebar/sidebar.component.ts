import { Component, signal, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { MenuItem } from '../../../types/menu-item';
import { TranslateModule } from '@ngx-translate/core';
import { PluralPipe } from '../../../pipes/plural.pipe';

export const MENU: MenuItem[] = [
  {
    icon: 'dashboard',
    title: 'dashboard',
    route: '/admin',
  },
  {
    icon: 'people',
    title: 'user',
    route: '/admin/users',
  },
  {
    icon: 'inventory_2',
    title: 'product',
    route: '/admin/products',
  },
  {
    icon: 'inventory',
    title: 'inventory',
    route: '/admin/inventory',
  },
  {
    icon: 'receipt_long',
    title: 'order',
    route: '/admin/orders',
  },
  {
    icon: 'analytics',
    title: 'analytic',
    route: '/admin/analytics',
  },
  {
    icon: 'settings',
    title: 'setting',
    route: '/admin/settings',
    children: [
      {
        title: 'payment',
        route: '/admin/settings/payment',
      },
      {
        title: 'shipping',
        route: '/admin/settings/shipping',
      },
      {
        title: 'site_info',
        route: '/admin/settings/site-info',
      },
    ],
  },
];

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterModule, MatIconModule, TranslateModule, PluralPipe],
})
export class AdminSidebarComponent implements OnInit {
  private router = inject(Router);
  private sub: any;
  currentUrl = signal('');
  menu!: MenuItem[];
  lastOpenedMenuItem!: MenuItem;

  constructor() {
    this.menu = MENU;
    this.navigateRoute();
  }

  ngOnInit() {
    this.currentUrl.set(this.router.url || '');
    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((ev: any) => {
        this.currentUrl.set(ev.urlAfterRedirects || ev.url || '');
      });
  }

  private navigateRoute() {
    if (this.menu.length > 0) {
      if (this.router.url == '/admin/dashboard') {
        if (this.menu[0].children?.length) {
          this.router.navigate([this.menu[0].children![0].route]);
        } else {
          this.router.navigate([this.menu[0].route]);
        }
      }
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onToggleExtendMenuItem(item: MenuItem) {
    const isAlreadyOpen = item.extended;
    this.menu.forEach((m) => (m.extended = false));
    // If it's not already open, open it
    item.extended = !isAlreadyOpen;
    if (item.extended) {
      this.lastOpenedMenuItem = item;
    }
  }

  isChildActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some((child) => this.isActive(child.route));
  }

  isActive(path: string) {
    // Use Angular Router's isActive to correctly handle exact vs prefix matches.
    // For the base dashboard path `/admin` we want an exact match only.
    const exact = path === '/admin';
    try {
      return this.router.isActive(path, exact);
    } catch (e) {
      // Fallback to previous behavior if router.isActive throws for some reason
      const url = this.currentUrl();
      return (
        url === path ||
        url.startsWith(path + '/') ||
        url.startsWith(path + '?') ||
        url.startsWith(path + '#')
      );
    }
  }
}
