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

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {
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
      value = value.replaceAll(',', '');
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
        newValue = newValue.replaceAll(',', '');
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
      newValue = newValue.replaceAll(',', '');
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
    const selectionStart = this.elementRef.nativeElement.selectionStart;
    const selectionEnd = this.elementRef.nativeElement.selectionEnd;

    if (newInput === 'Delete') {
      newValue = this.handleDelete(oldValue, selectionStart, selectionEnd);
    } else if (newInput === 'Backspace') {
      newValue = this.handleBackspace(oldValue, selectionStart, selectionEnd);
    } else if (selectionStart === null) {
      newValue += newInput;
    } else {
      newValue =
        oldValue.substring(0, selectionStart) +
        newInput +
        oldValue.substring(selectionEnd!, oldValue.length);
    }
    return newValue;
  }

  private handleDelete(
    oldValue: string,
    selectionStart: number | null,
    selectionEnd: number | null,
  ): string {
    if (selectionStart === null) return oldValue;
    let newValue = oldValue.substring(0, selectionStart);
    if (selectionStart === selectionEnd) {
      newValue += oldValue.substring((selectionEnd ?? 0) + 1, oldValue.length);
    } else {
      newValue += oldValue.substring(selectionEnd ?? 0, oldValue.length);
    }
    return newValue;
  }

  private handleBackspace(
    oldValue: string,
    selectionStart: number | null,
    selectionEnd: number | null,
  ): string {
    if (selectionStart === null || selectionStart <= 0) return oldValue;
    let newValue = '';
    if (selectionStart === selectionEnd) {
      newValue += oldValue.substring(0, selectionStart - 1);
    } else {
      newValue += oldValue.substring(0, selectionStart);
    }
    newValue += oldValue.substring(selectionEnd ?? 0, oldValue.length);
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
        // Simplified: matches dd-mm-yyyy, dd/mm/yyyy, dd.mm.yyyy, dd mm yyyy, yyyy-mm-dd, yyyy/mm/dd, yyyy.mm.dd, yyyy mm dd
        return /^(\d{2}[-/. ]\d{2}[-/. ]\d{4}|\d{4}[-/. ]\d{2}[-/. ]\d{2})$/;
      default:
        if (this.inputRestrictCustom) {
          return new RegExp(this.inputRestrictCustom);
        }
        return null;
    }
  }
}
