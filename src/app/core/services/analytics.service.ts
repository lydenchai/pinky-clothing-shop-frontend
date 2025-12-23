import { Injectable, Injector } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, catchError } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AnalyticsEvent } from '../types/analytic';
import { BaseCrudService } from './base-crud.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService extends BaseCrudService<AnalyticsEvent> {
  constructor(injector: Injector, private router: Router) {
    super(injector);
    this.path = '/analytics/';
  }

  init() {
    // Google Analytics page view tracking
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.sendPageView(event.urlAfterRedirects);
      });
  }

  sendPageView(url: string) {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'page_view', { page_path: url });
    }
  }

  sendEvent(eventName: string, params: Record<string, any> = {}) {
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  }

  // Log a custom event to the backend
  logEvent(type: string, data?: any, user_id?: number): Observable<any> {
    return this.httpClientService
      .postJSON(this.path, { data: { type, data, user_id } })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  // Fetch recent analytics events
  getEvents(): Observable<AnalyticsEvent[]> {
    return this.httpClientService.getJSON<AnalyticsEvent[]>(this.path);
  }

  // Fetch analytics summary for admin dashboard
  getSummary(): Observable<any> {
    return this.httpClientService.getJSON<any>(`${this.path}summary`);
  }
}
