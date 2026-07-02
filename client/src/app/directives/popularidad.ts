import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appPopularidad]',
})
export class Popularidad {
  @Input() appPopularidad!: number;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    const likes = Number(this.appPopularidad);

    if (likes > 5) {
      this.el.nativeElement.style.color = 'white';
      this.el.nativeElement.style.fontWeight = 'bold';
    } else {
      this.el.nativeElement.style.color = '';
      this.el.nativeElement.style.fontWeight = '';
    }
  }
}
