import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';

@Pipe({
  name: 'isRequired$',
})
export class IsRequiredPipe implements PipeTransform {
  transform(control: FormControl<any>) {
    return control.statusChanges.pipe(
      map(() => control.hasValidator(Validators.required)),
      startWith(control.hasValidator(Validators.required))
    );
  }
}
