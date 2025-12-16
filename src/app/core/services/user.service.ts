import { Injectable, Injector } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { User } from '../types/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseCrudService<User> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/users/';
  }
}
