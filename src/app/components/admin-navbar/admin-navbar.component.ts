import { Component, HostListener, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { LocalStorageService } from '../../services/local-storage.service';
import { LanguageEnum } from '../../types/enums/language.enum';
import { LocalStorageEnum } from '../../types/enums/local-storage.enum';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterModule, TranslateModule, MatIconModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
})
export class AdminNavbarComponent {
  langMenuOpen = false;
  currentLang = signal<LanguageEnum>(LanguageEnum.EN);
  availableLangs: LanguageEnum[] = [
    LanguageEnum.EN,
    LanguageEnum.KM,
    LanguageEnum.FR,
    LanguageEnum.CH,
  ];
  constructor(
    public translate: TranslateService,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService
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
    const langMenu = target.closest('.lang-img');

    if (!langMenu && this.langMenuOpen) {
      this.langMenuOpen = false;
    }
  }
}
