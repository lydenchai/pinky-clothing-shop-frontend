import { Injector } from '@angular/core';
import { RequestOption } from '../types/request-option';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseData } from '../types/base-data';
import { BaseDatatable } from '../types/base-datatable';
import { MongoObject } from '../types/mongo-object';
import { HttpClientService } from './http-client.service';

export class BaseCrudService<T> {
  protected path: string = '';
  protected httpClientService: HttpClientService;

  constructor(injector: Injector) {
    this.httpClientService = injector.get(HttpClientService);
  }

  getMany<ET = {}>(
    data?: {
      q?: string;
      page?: number;
      limit?: number;
      populate?: string;
      select?: string;
      sort?: string;
      [key: string]: any;
    },
    options?: RequestOption
  ) {
    data =
      data &&
      Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''));
    let result = this.httpClientService.getJSON<BaseDatatable<T & ET>>(
      this.path,
      {
        data,
        isAlertError: options?.isAlertError ?? true,
        isLoading: options?.isLoading ?? true,
      }
    );
    if (options?.destroyRef) {
      result = result.pipe(takeUntilDestroyed(options.destroyRef));
    }
    return result;
  }

  getOne(
    data?: {
      populate?: string;
      sort?: string;
      select?: string;
      [key: string]: any;
    },
    options?: RequestOption
  ) {
    let result = this.httpClientService.getJSON<BaseData<T>>(
      this.path + '/one',
      {
        data,
        isAlertError: options?.isAlertError ?? true,
        isLoading: options?.isLoading ?? true,
      }
    );
    if (options?.destroyRef) {
      result = result.pipe(takeUntilDestroyed(options.destroyRef));
    }
    return result;
  }

  getById(
    _id: string,
    data?: {
      populate?: string;
      select?: string;
      [key: string]: any;
    },
    options?: RequestOption
  ) {
    let result = this.httpClientService.getJSON<BaseData<T>>(
      this.path + '/find/' + _id,
      {
        data,
        isAlertError: options?.isAlertError ?? true,
        isLoading: options?.isLoading ?? true,
      }
    );
    if (options?.destroyRef) {
      result = result.pipe(takeUntilDestroyed(options.destroyRef));
    }
    return result;
  }

  create(data: T, options?: RequestOption) {
    let result = this.httpClientService.postJSON<BaseData<T>>(
      this.path + '/create/',
      {
        data,
        isAlertError: options?.isAlertError ?? true,
        isLoading: options?.isLoading ?? true,
      }
    );
    if (options?.destroyRef) {
      result = result.pipe(takeUntilDestroyed(options.destroyRef));
    }
    return result;
  }

  update(data: Partial<T>, options?: RequestOption) {
    let obj = data as MongoObject;
    delete obj._id;
    let result = this.httpClientService.patchJSON<BaseData<T>>(
      this.path + '/update',
      {
        data: obj,
        isAlertError: options?.isAlertError ?? true,
        isLoading: options?.isLoading ?? true,
      }
    );
    if (options?.destroyRef) {
      result = result.pipe(takeUntilDestroyed(options.destroyRef));
    }
    return result;
  }

  updateById(_id: string, data: Partial<T>, options?: RequestOption) {
    let obj = data as MongoObject;
    delete obj._id;
    let result = this.httpClientService.patchJSON<BaseData<T>>(
      this.path + '/update/' + _id,
      {
        data: obj,
        isAlertError: options?.isAlertError ?? true,
        isLoading: options?.isLoading ?? true,
      }
    );
    if (options?.destroyRef) {
      result = result.pipe(takeUntilDestroyed(options.destroyRef));
    }
    return result;
  }

  delete(_id: string, options?: RequestOption) {
    let result = this.httpClientService.deleteJSON<BaseData<T>>(
      this.path + '/delete/' + _id,
      {
        isAlertError: options?.isAlertError ?? true,
        isLoading: options?.isLoading ?? true,
      }
    );
    if (options?.destroyRef) {
      result = result.pipe(takeUntilDestroyed(options.destroyRef));
    }
    return result;
  }
}
