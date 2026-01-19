import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Breadcrumb } from '../types/breadcrumb';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  readonly breadcrumbs = signal<Breadcrumb[]>([]);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs.set(this.build(this.route.root));
      });
  }

  private build(
    route: ActivatedRoute,
    url = '',
    crumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    for (const child of route.children) {
      const segment = child.snapshot.url.map((s) => s.path).join('');
      const isListPage = segment === '';
      let nextUrl = url;
      if (!isListPage && segment) {
        nextUrl += `/${segment}`;
      }
      const label = child.snapshot.data['breadcrumb'];
      const plural = child.snapshot.data['plural'];
      if (label && (!isListPage || crumbs.length === 0)) {
        crumbs = [...crumbs, { label, url: nextUrl || '/', plural }];
      }
      crumbs = this.build(child, nextUrl, crumbs);
    }

    return crumbs;
  }
}
