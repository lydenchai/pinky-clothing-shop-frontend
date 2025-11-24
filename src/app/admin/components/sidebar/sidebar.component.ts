import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterModule, MatIconModule],
})
export class AdminSidebarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private sub: any;
  currentUrl = signal('');

  ngOnInit() {
    this.currentUrl.set(this.router.url || '');
    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((ev: any) => {
        this.currentUrl.set(ev.urlAfterRedirects || ev.url || '');
      });
  }

  ngOnDestroy() {
    try {
      this.sub?.unsubscribe();
    } catch (e) {}
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
