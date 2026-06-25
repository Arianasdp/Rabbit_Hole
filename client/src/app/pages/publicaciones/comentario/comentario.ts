import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { IComentario } from './comentario.interface';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComentariosService } from '../comentarios.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-comentario',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './comentario.html',
  styleUrl: './comentario.css',
})
export class Comentario {

  authService = inject(AuthService);
  comentarioService = inject(ComentariosService);

  comentario = input.required<IComentario>();

  editing = signal(false);

  miForm: FormGroup;

  @Output() comentarioEdited = new EventEmitter<IComentario>();

  constructor(private fb: FormBuilder) {
    this.miForm = this.fb.group({
        description: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(140)]],
      });
  }

  get description() {
    return this.miForm.get('description');
  }

  async accion() {

    if (this.miForm.invalid) {
      return;
    }
    console.log("comentario entero: ", this.comentario());
    console.log("id_publi en comments:", this.comentario().publicacion_id);

    const datos = this.miForm.getRawValue();
    
    const formData = new FormData();

    Object.entries(datos).forEach(([key, value]) => {
        formData.append(key, String(value));
    });

    try {
      console.log("id_publi en try:", this.comentario().publicacion_id);
    const comentarioActualizado =
      await this.comentarioService.editarComentario(
        this.comentario().publicacion_id,
        this.comentario()._id,
        formData
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
