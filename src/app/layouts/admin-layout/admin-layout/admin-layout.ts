import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { AdminNavbar } from '../admin-navbar/admin-navbar';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LocalStorageEnum } from '../../../core/types/enums/local-storage.enum';
import { Breadcrumb } from '../../../shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, AdminSidebar, AdminNavbar, Breadcrumb],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss'],
})
export class AdminLayout implements OnInit, OnDestroy {
  private _prevMainPaddingTop: string | null = null;
  menuExtended = false;

  constructor(private readonly localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    try {
      document.body.classList.add('no-global-layout');
    } catch (e) {
      console.error(e);
    }

    this.checkScreenAndSetSidebar();
    window.addEventListener('resize', this.checkScreenAndSetSidebar);

    // Also remove the top padding reserved for the global header from the .main-content
    try {
      const main = document.querySelector('.main-content');
      if (main) {
        const mainEl = main as HTMLElement;
        // Prefer inline style if set, otherwise use computed value
        const inline = mainEl.style.paddingTop;
        const computed = globalThis.getComputedStyle(mainEl).paddingTop;
        this._prevMainPaddingTop =
          inline && inline !== '' ? inline : computed || null;
        mainEl.style.paddingTop = '0px';
      }
    } catch (e) {
      console.error(e);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenAndSetSidebar);
    try {
      document.body.classList.remove('no-global-layout');
    } catch (e) {
      console.error(e);
    }

    try {
      const main = document.querySelector('.main-content');
      if (main) {
        const mainEl = main as HTMLElement;
        if (this._prevMainPaddingTop == null) {
          mainEl.style.removeProperty('padding-top');
        } else {
          mainEl.style.paddingTop = this._prevMainPaddingTop;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  private readonly checkScreenAndSetSidebar = () => {
    if (window.innerWidth <= 1440) {
      this.menuExtended = false;
    } else {
      let extended = this.localStorageService.get(
        LocalStorageEnum.menuExtended,
      );
      if (extended === null) {
        this.menuExtended = true;
      } else {
        this.menuExtended = extended === 'true';
      }
    }
  };

  onMenuExtendedChange(value: boolean) {
    this.menuExtended = value;
    this.localStorageService.set(
      LocalStorageEnum.menuExtended,
      value ? 'true' : 'false',
    );
  }
}
