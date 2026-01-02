import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { SiteInfo } from '../types/site-info';

@Injectable({ providedIn: 'root' })
export class SiteInfoService extends BaseCrudService<SiteInfo> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/site-info/';
  }

  getSiteInfo(): Observable<SiteInfo> {
    return this.httpClientService.getJSON<SiteInfo>(`${this.path}`);
  }

  updateSiteInfo(data: SiteInfo): Observable<SiteInfo> {
    return this.httpClientService.patchJSON<SiteInfo>(`${this.path}/update`, {
      data: data,
    });
  }
}
