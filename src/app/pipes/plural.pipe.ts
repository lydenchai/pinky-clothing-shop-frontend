import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { plural } from 'pluralize';
import { LanguageEnum } from '../types/enums/language.enum';

@Pipe({
  name: 'plural',
})
export class PluralPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(value: string): string {
    return this.translateService.currentLang === LanguageEnum.EN
      ? plural(value)
      : value;
  }
}
