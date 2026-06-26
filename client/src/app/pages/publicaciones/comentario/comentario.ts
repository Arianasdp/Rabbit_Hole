import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { IComentario } from './comentario.interface';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComentariosService } from '../comentarios.service';
import { AuthStateService } from '../../../auth/auth-state.service';

@Component({
  selector: 'app-comentario',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './comentario.html',
  styleUrl: './comentario.css',
})
export class Comentario {

  authService = inject(AuthStateService);
  comentarioService = inject(ComentariosService);

  comentario = input.required<IComentario>();
  publicacionId = input.required<string>();

  editing = signal(false);

  miForm: FormGroup;

  @Output() comentarioEdited = new EventEmitter<IComentario>();

  constructor(private fb: FormBuilder) {
    this.miForm = this.fb.group({
        description: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(140)]],
      });
  }

  ngOnInit() {
  console.log('comentario init');
  console.log('publicacionId:', this.publicacionId());
}

  get description() {
    return this.miForm.get('description');
  }

  async accion() {

    if (this.miForm.invalid) {
      return;
    }

    console.log('comentario', this.comentario());
    console.log('publicacionId input', this.publicacionId);

    const datos = this.miForm.getRawValue();

    try {
    const publicacionId = this.publicacionId();
    if (!publicacionId) {
      console.error('No llegó publicacionId');
      return;
    }
    const comentarioActualizado =
      await this.comentarioService.editarComentario(
        this.publicacionId(),
        this.comentario()._id,
        datos
      );

    this.comentarioEdited.emit(comentarioActualizado);

    this.editing.set(false);
    } catch(error) {
      console.log(error);
    }
  }

  editar() {

      this.miForm.patchValue({
        description: this.comentario().description
      });

      this.editing.set(true);
  }
}
