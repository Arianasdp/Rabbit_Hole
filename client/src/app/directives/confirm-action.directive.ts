import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';

@Directive({
    selector: '[appConfirmAction]',
    standalone: true
})
export class ConfirmActionDirective {

    @Input('appConfirmAction') confirmMessage: string = 'Seguro que querés proceder?';

    @Output() confirmed = new EventEmitter<void>();

    @HostListener('click', ['$event'])
    onClientClick(event: MouseEvent): void {

        event.preventDefault();
        event.stopPropagation();

        const hasConfirmed = window.confirm(this.confirmMessage);

        if (hasConfirmed) {
        this.confirmed.emit();
        }
    }
}