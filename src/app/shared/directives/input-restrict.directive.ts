import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: 'input[inputRestrict], input[inputRestrictCustom]',
})
export class InputRestrictDirective implements OnChanges {
  @Input() inputRestrict:
    | 'integer'
    | 'n-integer'
    | 'p-integer'
    | 'decimal'
    | 'p-decimal'
    | 'n-decimal'
    | 'latin'
    | 'khmer'
    | 'date'
    | 'custom' = 'custom';

  @Input() inputRestrictCustom?: string;
  private regEx: RegExp | null = null;

  constructor(private elementRef: ElementRef<HTMLInputElement>) {
    elementRef.nativeElement.type = 'text'; // get selectionStart-End only support type text
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.regEx = this.getReqEx();
    const inputEle = this.elementRef.nativeElement;
    let value = inputEle.value;

    if (
      [
        'integer',
        'n-integer',
        'p-integer',
        'decimal',
        'p-decimal',
        'n-decimal',
      ].includes(this.inputRestrict)
    ) {
      value = value.replace(/,/g, '');
    }
    if (value && this.regEx && !this.regEx.test(value)) {
      inputEle.value = '';
      const inputEvent = new Event('input', { bubbles: true });
      inputEle.dispatchEvent(inputEvent);
    }
  }

  @HostListener('paste', ['$event'])
  onPast(e: ClipboardEvent) {
    let newInput = e.clipboardData?.getData('text/plain');
    if (newInput) {
      let newValue = this.getNewData(newInput);
      if (
        [
          'integer',
          'n-integer',
          'p-integer',
          'decimal',
          'p-decimal',
          'n-decimal',
        ].includes(this.inputRestrict)
      ) {
        // remove format before validate
        newValue = newValue.replace(/,/g, '');
      }
      if (!this.regEx || this.regEx.test(newValue)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      [
        'Tab',
        'Escape',
        'Enter',
        'End',
        'Home',
        'ArrowLeft',
        'ArrowUp',
        'ArrowRight',
        'ArrowDown',
        'Shift',
        'Alt',
        'Control',
      ].indexOf(e.key) !== -1 ||
      (e.ctrlKey === true &&
        (e.key == 'a' ||
          e.key == 'c' ||
          e.key == 'v' ||
          e.key == 'x' ||
          e.key == 'z' ||
          e.key == 'Z' ||
          e.key == 'y'))
    ) {
      // allow input without validate
      return;
    }
    let newValue = this.getNewData(e.key);
    if (
      [
        'integer',
        'n-integer',
        'p-integer',
        'decimal',
        'p-decimal',
        'n-decimal',
      ].includes(this.inputRestrict)
    ) {
      if (e.key == ',') {
        // prevent input format from user, only directive can add format
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // remove format before validate
      newValue = newValue.replace(/,/g, '');
    }
    if (!newValue || !this.regEx || this.regEx.test(newValue)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  getNewData(newInput: string) {
    const oldValue = this.elementRef.nativeElement.value;
    let newValue = oldValue;
    if (newInput == 'Delete') {
      if (this.elementRef.nativeElement.selectionStart !== null) {
        newValue = oldValue.substring(
          0,
          this.elementRef.nativeElement.selectionStart
        );
        if (
          this.elementRef.nativeElement.selectionStart ==
          this.elementRef.nativeElement.selectionEnd
        ) {
          newValue += oldValue.substring(
            this.elementRef.nativeElement.selectionEnd! + 1,
            oldValue.length
          );
        } else {
          newValue += oldValue.substring(
            this.elementRef.nativeElement.selectionEnd!,
            oldValue.length
          );
        }
      }
    } else if (newInput == 'Backspace') {
      if (
        this.elementRef.nativeElement.selectionStart !== null &&
        this.elementRef.nativeElement.selectionStart > 0
      ) {
        newValue = '';
        if (
          this.elementRef.nativeElement.selectionStart ==
          this.elementRef.nativeElement.selectionEnd
        ) {
          newValue += oldValue.substring(
            0,
            this.elementRef.nativeElement.selectionStart - 1
          );
        } else {
          newValue += oldValue.substring(
            0,
            this.elementRef.nativeElement.selectionStart
          );
        }
        newValue += oldValue.substring(
          this.elementRef.nativeElement.selectionEnd!,
          oldValue.length
        );
      }
    } else {
      if (this.elementRef.nativeElement.selectionStart !== null) {
        newValue =
          oldValue.substring(0, this.elementRef.nativeElement.selectionStart) +
          newInput +
          oldValue.substring(
            this.elementRef.nativeElement.selectionEnd!,
            oldValue.length
          );
      } else {
        newValue += newInput;
      }
    }
    return newValue;
  }

  private getReqEx() {
    switch (this.inputRestrict) {
      case 'integer':
        return /^-?\d*$/;
      case 'n-integer':
        return /^-\d*$/;
      case 'p-integer':
        return /^\d*$/;
      case 'decimal':
        return /^-?\d*(\.\d*)?$/;
      case 'n-decimal':
        return /^-\d*(\.\d*)?$/;
      case 'p-decimal':
        return /^\d*(\.\d*)?$/;
      case 'latin':
        return /^(?:[a-zA-Z] ?)+$/;
      case 'khmer':
        return /^(?:[\u1780-\u17FF] ?)+$/;
      case 'date':
        return /^((([0-3]|0[1-9]|[12][0-9]|3[01])|((0[1-9]|[12][0-9]|3[01])(([01]|0[1-9]|1[0-2])|(0[1-9]|1[0-2])([12]|[12][0-9]{0,3}))))|(([0-3]|0[1-9]|[12][0-9]|3[01])|((0[1-9]|[12][0-9]|3[01])(-|-(([01]|0[1-9]|1[0-2])|(0[1-9]|1[0-2])(-|-([12]|[12][0-9]{0,3}))))))|(([0-3]|0[1-9]|[12][0-9]|3[01])|((0[1-9]|[12][0-9]|3[01])(\/|\/(([01]|0[1-9]|1[0-2])|(0[1-9]|1[0-2])(\/|\/([12]|[12][0-9]{0,3})))))))$/;
      default:
        if (this.inputRestrictCustom) {
          return new RegExp(this.inputRestrictCustom);
        }
        return null;
    }
  }
}
