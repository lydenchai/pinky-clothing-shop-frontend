import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { AdminNavbar } from '../admin-navbar/admin-navbar';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LocalStorageEnum } from '../../../core/types/enums/local-storage.enum';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebar, AdminNavbar],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss'],
})
export class AdminLayout implements OnInit, OnDestroy {
  private _prevMainPaddingTop: string | null = null;
  menuExtended = false;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    try {
      document.body.classList.add('no-global-layout');
    } catch (e) {}

    this.checkScreenAndSetSidebar();
    window.addEventListener('resize', this.checkScreenAndSetSidebar);

    // Also remove the top padding reserved for the global header from the .main-content
    try {
      const main = document.querySelector(
        '.main-content'
      ) as HTMLElement | null;
      if (main) {
        // Save computed or inline value so we can restore on destroy
        const computed = window.getComputedStyle(main).paddingTop || '';
        this._prevMainPaddingTop = main.style.paddingTop || computed || null;
        main.style.paddingTop = '0px';
      }
    } catch (e) {
      // ignore
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenAndSetSidebar);
    try {
      document.body.classList.remove('no-global-layout');
    } catch (e) {}

    try {
      const main = document.querySelector(
        '.main-content'
      ) as HTMLElement | null;
      if (main) {
        if (this._prevMainPaddingTop != null) {
          main.style.paddingTop = this._prevMainPaddingTop;
        } else {
          main.style.removeProperty('padding-top');
        }
      }
    } catch (e) {
      // ignore
    }
  }

  private checkScreenAndSetSidebar = () => {
    if (window.innerWidth <= 1440) {
      this.menuExtended = false;
    } else {
      let extended = this.localStorageService.get(
        LocalStorageEnum.menuExtended
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
      value ? 'true' : 'false'
    );
  }
}
