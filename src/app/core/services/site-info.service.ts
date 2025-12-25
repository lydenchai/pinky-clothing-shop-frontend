import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { SiteInfo } from '../types/site-info';

@Injectable({ providedIn: 'root' })
export class SiteInfoService extends BaseCrudService<any> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/site-info/';
  }

  getSiteInfo(): Observable<SiteInfo> {
    return this.httpClientService.getJSON<any>(`${this.path}`);
  }

  updateSiteInfo(data: SiteInfo): Observable<SiteInfo> {
    return this.httpClientService.patchJSON<any>(`${this.path}`, {
      data: data,
    });
  }
}
