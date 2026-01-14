import { Directive, ElementRef, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appInputBouncer]',
})
export class InputBouncerDirective {
  keyUpTimeout?: any;

  keyUpBouncer = output<string>();
  @HostListener('keyup') onClick() {
    if (this.keyUpTimeout) {
      clearTimeout(this.keyUpTimeout);
    }
    this.keyUpTimeout = setTimeout(() => {
      this.keyUpBouncer.emit(this.elementRef.nativeElement.value);
      this.keyUpTimeout = undefined;
    }, 300);
  }
  
  constructor(private elementRef: ElementRef) {}

  ngOnDestroy(): void {
    if (this.keyUpTimeout) {
      clearTimeout(this.keyUpTimeout);
    }
  }
}
