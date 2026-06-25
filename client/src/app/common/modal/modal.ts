import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {

  @Input() titulo = '';

  @Input() mensaje = '';

  @Output() aceptar = new EventEmitter<void>();
  
  @Output() cancelar = new EventEmitter<void>();
}
