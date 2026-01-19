import { Pipe, PipeTransform } from '@angular/core';
import { FilterObjectPipe } from './filter-object.pipe';

@Pipe({
  name: 'findObject',
})
export class FindObjectPipe implements PipeTransform {
  transform(
    array: any[],
    findKey: string | string[],
    option: 'startWith' | 'includes' | 'equal',
    filterValue: any,
  ): null {
    let pipe = new FilterObjectPipe();
    return pipe.transform(array, findKey, option, filterValue)?.[0];
  }
}
