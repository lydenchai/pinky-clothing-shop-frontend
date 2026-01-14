import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterObject',
})
export class FilterObjectPipe implements PipeTransform {
  transform(
    array: any[],
    filterKey: string | string[],
    option: 'startWith' | 'includes' | 'equal',
    filterValue: any,
    limit?: number
  ): any[] {
    let result: any[];
    if (!array) {
      return [];
    }
    if (Array.isArray(filterKey)) {
      result = array.filter((a) => {
        switch (option) {
          case 'startWith':
            return this.getValueNested(a, filterKey).startsWith(filterValue);
          case 'includes':
            return this.getValueNested(a, filterKey).includes(filterValue);
          case 'equal':
            return this.getValueNested(a, filterKey) === filterValue;
          default:
            return false;
        }
      });
    } else {
      result = array.filter((a) => {
        switch (option) {
          case 'startWith':
            return a[filterKey].startsWith(filterValue);
          case 'includes':
            return a[filterKey].includes(filterValue);
          case 'equal':
            return a[filterKey] === filterValue;
          default:
            return false;
        }
      });
    }
    if (limit) {
      return result.slice(0, limit);
    }
    return result;
  }
  /**
   * get value from nested object
   * @param object Object
   * @param keys Array of nested key
   */
  private getValueNested(object: any, keys: string[]): any {
    if (keys.length == 1) {
      return object[keys[0]];
    } else {
      return this.getValueNested(object[keys[0]], keys.slice(1));
    }
  }
}
