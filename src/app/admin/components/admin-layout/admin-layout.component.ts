import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private _prevMainPaddingTop: string | null = null;

  ngOnInit(): void {
    try {
      document.body.classList.add('no-global-layout');
    } catch (e) {}

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
}
