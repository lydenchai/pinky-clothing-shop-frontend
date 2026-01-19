import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _isLoading = false;
  private readonly _isLoading$ = new BehaviorSubject(false);
  isLoading$: Observable<boolean> = this._isLoading$;
  counter = 0;

  constructor() {}

  setLoading(isLoading: boolean) {
    if (isLoading) {
      this.counter++;
    } else {
      this.counter = Math.max(this.counter - 1, 0);
    }
    this._isLoading = this.counter > 0;
    this._isLoading$.next(this._isLoading);
  }

  forceStop() {
    this.counter = 0;
    this._isLoading = false;
    this._isLoading$.next(this._isLoading);
  }
}
