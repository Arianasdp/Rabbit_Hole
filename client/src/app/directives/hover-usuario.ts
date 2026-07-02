import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverUsuario]',
})
export class HoverUsuario {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.color = '#6a6792';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.color = '';
  }
}
