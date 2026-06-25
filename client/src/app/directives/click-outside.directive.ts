import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[appClickOutside]',
    standalone: true
})

export class ClickOutsideDirective {
    constructor(private elementRef: ElementRef) {}

    @Output() appClickOutside = new EventEmitter<MouseEvent>();

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent): void {
        const target = event.target as HTMLElement | null;

        if (!target) return;

        const clickedInside =
            this.elementRef.nativeElement.contains(target);

        if (!clickedInside) {
            console.log('CLICK AFUERA');
            this.appClickOutside.emit(event);
        }
    }
}