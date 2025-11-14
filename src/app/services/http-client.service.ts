import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core'; 
import { catchError, filter, finalize, map, Observable, throwError } from 'rxjs';
import { RequestParam } from '../types/request-param'; 
import { environment } from '../../environments/environment';
import { SnackbarService } from './snackbar.service';
import { LoadingService } from './loading.service';
import { APIResponseCodeEnum } from '../types/enums/api-response-code.enum';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private snackbarService?: SnackbarService;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private injector: Injector,
  ) {}

  getUrl(path: string, queryParams?: { [key: string]: any }) {
    let arr = path.split('/').filter((v) => v);
    arr.unshift(environment.apiUrl);
    const urlPath = arr.join('/');
    if (queryParams) {
      this.clean(queryParams, true);
      const url = new URL(urlPath);
      for (const [key, value] of Object.entries(queryParams)) {
        url.searchParams.append(key, value);
      }
      return url.toString();
    }

    return urlPath;
  }
  get<T>(path: string, request: RequestParam = {}) {
    const url = this.getUrl(path);
    this.clean(request.data, true);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }
    return this.http.get<T>(url, { params: request.data }).pipe(
      catchError((err) => this.handleHttpError(err, request.isAlertError)),
      finalize(() => this.finalizeRequest(request.isLoading)),
    );
  }

  getBlob(path: string, request: RequestParam = {}) {
    const url = this.getUrl(path);
    this.clean(request.data, true);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }
    return this.http.get(url, { params: request.data, responseType: 'blob' }).pipe(
      catchError((err) => this.handleHttpError(err, request.isAlertError)),
      finalize(() => this.finalizeRequest(request.isLoading)),
    );
  }

  getJSON<T>(path: string, request: RequestParam = {}) {
    const url = this.getUrl(path);
    this.clean(request.data, true);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<T>(url, { params: request.data, headers }).pipe(
      catchError((err) => this.handleHttpError(err, request.isAlertError)),
      finalize(() => this.finalizeRequest(request.isLoading)),
    );
  }

  post<T>(path: string, request: RequestParam) {
    const url = this.getUrl(path);
    this.clean(request.data);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    request.data = this.toFormData(request.data);
    return this.http.post<T>(url, request.data, { headers }).pipe(
      catchError((err) => this.handleHttpError(err, request.isAlertError)),
      finalize(() => this.finalizeRequest(request.isLoading)),
    );
  }

  postJSON<T>(path: string, request: RequestParam) {
    const url = this.getUrl(path);
    this.clean(request.data);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<T>(url, request.data, { headers }).pipe(
      catchError((err) => this.handleHttpError(err, request.isAlertError)),
      finalize(() => this.finalizeRequest(request.isLoading)),
    );
  }

  postFile<T>(path: string, request: RequestParam): Observable<T> {
    const url = this.getUrl(path);
    this.clean(request.data);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data;boundary=abc',
    });
    request.data = this.toFormData(request.data);
    return this.http.post<T>(url, request.data, { headers }).pipe(
      catchError((err) => this.handleHttpError(err, request.isAlertError)),
      finalize(() => this.finalizeRequest(request.isLoading)),
    );
  }

  postFileProgress<T>(path: string, request: RequestParam): Observable<number | T> {
    const url = this.getUrl(path);
    this.clean(request.data);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data;boundary=abc',
    });
    request.data = this.toFormData(request.data);
    return this.http
      .post<T>(url, request.data, { headers, reportProgress: true, responseType: 'json', observe: 'events' })
      .pipe(
        filter((res) => res.type == HttpEventType.UploadProgress || res.type == HttpEventType.Response),
        map((res) => {
          if (res.type == HttpEventType.UploadProgress) {
            return Math.round((res.loaded / (res.total || 0)) * 100);
          } else {
            return (res as HttpResponse<T>).body || ({} as T);
          }
        }),
        catchError((err) => this.handleHttpError(err, request.isAlertError)),
        finalize(() => this.finalizeRequest(request.isLoading)),
      );
  }

  patchFileProgress<T>(path: string, request: RequestParam): Observable<number | T> {
    const url = this.getUrl(path);
    this.clean(request.data);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data;boundary=abc',
    });
    request.data = this.toFormData(request.data);
    return this.http
      .patch<T>(url, request.data, { headers, reportProgress: true, responseType: 'json', observe: 'events' })
      .pipe(
        filter((res) => res.type == HttpEventType.UploadProgress || res.type == HttpEventType.Response),
        map((res) => {
          if (res.type == HttpEventType.UploadProgress) {
            return Math.round((res.loaded / (res.total || 0)) * 100);
          } else {
            return (res as HttpResponse<T>).body || ({} as T);
          }
        }),
        catchError((err) => this.handleHttpError(err, request.isAlertError)),
        finalize(() => this.finalizeRequest(request.isLoading)),
      );
  }

  patchJSON<T>(path: string, request: RequestParam) {
    const url = this.getUrl(path);
    this.clean(request.data);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'If-Match': '1',
    });
    return this.http.patch<T>(url, request.data, { headers }).pipe(
      catchError((err) => this.handleHttpError(err, request.isAlertError)),
      finalize(() => this.finalizeRequest(request.isLoading)),
    );
  }

  deleteJSON<T>(path: string, request: RequestParam = {}) {
    const url = this.getUrl(path);
    this.clean(request.data);
    if (request.isLoading) {
      this.loadingService.setLoading(true);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete<T>(url, { headers, params: request.data }).pipe(
      catchError((err) => this.handleHttpError(err, request.isAlertError)),
      finalize(() => this.finalizeRequest(request.isLoading)),
    );
  }

  private clean(obj: any, isCleanQuery = false) {
    for (const propName in obj) {
      if (obj[propName] === undefined || (isCleanQuery && obj[propName] === null)) {
        delete obj[propName];
      } else if (obj[propName] instanceof Date) {
        (obj[propName] as Date).setMilliseconds(0);
        obj[propName] = (obj[propName] as Date).toISOString();
      } else if (typeof obj[propName] == 'object' && !(obj[propName] instanceof File)) {
        this.clean(obj[propName]);
      }
    }
  }

  private handleHttpError(error: HttpErrorResponse, is_alert_error?: boolean) {
    if (is_alert_error) {
      const snackbar = this.getSnackbarService();
      if (error.status === APIResponseCodeEnum.user_error) {
        snackbar.openSnackbarError(error.error?.error || error.statusText);
      } else if (error.status === APIResponseCodeEnum.server_error) {
        snackbar.openSnackbarError(error.error?.error || error.statusText);
      } else if (
        error.status !== APIResponseCodeEnum.not_found &&
        error.status !== APIResponseCodeEnum.expired_token &&
        error.status !== APIResponseCodeEnum.invalid_token
      ) {
        snackbar.openSnackbarError('m.unknown_http_error');
      }
    }
    return throwError(() => error.error);
  }

  private finalizeRequest(is_loading?: boolean) {
    if (is_loading) {
      this.loadingService.setLoading(false);
    }
  }

  private toFormData(formValue: any) {
    const formData = new FormData();
    //to append files to last of form data
    const fileKeys = [];
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      if (typeof value.name == 'string') {
        fileKeys.push(key);
        continue;
      }
      formData.append(key, value);
    }
    for (const key of fileKeys) {
      formData.append(key, formValue[key]);
    }
    return formData;
  }

  private getSnackbarService(): SnackbarService {
    // Lazy load to avoid circular DI at app start
    if (!this.snackbarService) {
      this.snackbarService = this.injector.get(SnackbarService);
    }
    return this.snackbarService;
  }
}
