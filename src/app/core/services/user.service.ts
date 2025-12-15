import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';
import { User } from '../types/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseCrudService<User> {
  constructor(injector: Injector, private http: HttpClient) {
    super(injector);
    this.path = '/users/';
  }
}
