import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../types/user.model';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseCrudService<User> {
  constructor(injector: Injector, private http: HttpClient) {
    super(injector);
    this.path = '/users/';
  }
}
