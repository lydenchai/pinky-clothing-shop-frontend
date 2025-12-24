import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SiteInfo {
  name: string;
  description: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class SiteInfoService {
  private apiUrl = environment.apiUrl + '/site-info';

  constructor(private http: HttpClient) {}

  getSiteInfo(): Observable<SiteInfo> {
    return this.http.get<{ success: boolean; data: SiteInfo }>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  updateSiteInfo(info: Partial<SiteInfo>): Observable<SiteInfo> {
    return this.http.put<{ success: boolean; data: SiteInfo }>(this.apiUrl, info).pipe(
      map(res => res.data)
    );
  }
}
