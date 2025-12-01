import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AnalyticsEvent } from '../types/analytic';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private router: Router, private http: HttpClient) {}

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
  logEvent(type: string, data?: any, userId?: number): Observable<any> {
    return this.http.post(this.apiUrl, { type, data, userId }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  // Fetch recent analytics events
  getEvents(): Observable<AnalyticsEvent[]> {
    return this.http.get<AnalyticsEvent[]>(this.apiUrl).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}
