import { Component, EventEmitter, input, Output } from '@angular/core';
import { IComentario } from './comentario.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comentario',
  imports: [DatePipe],
  templateUrl: './comentario.html',
  styleUrl: './comentario.css',
})
export class Comentario {

  comentario = input.required<IComentario>();

  @Output() comentarioEdited = new EventEmitter<IComentario>();
}
