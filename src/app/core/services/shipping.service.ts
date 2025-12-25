import { Injectable, Injector } from '@angular/core';
import { ShippingMethod } from '../types/shipping-method';
import { BaseCrudService } from './base-crud.service';

@Injectable({ providedIn: 'root' })
export class ShippingService extends BaseCrudService<ShippingMethod> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/shippings/';
  }
}
