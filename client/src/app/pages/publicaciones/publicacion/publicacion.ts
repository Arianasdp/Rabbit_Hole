import { Component, computed, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { IPublicacion } from './publicacion.interface';
import { PublicacionesService } from '../publicaciones.service';
import { DatePipe } from '@angular/common';
import { Modal } from '../../../common/modal/modal';
import { ComentariosService } from '../comentarios.service';
import { Comentario } from "../comentario/comentario";
import { IComentario } from '../comentario/comentario.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStateService } from '../../../auth/auth-state.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-publicacion',
  imports: [DatePipe, Modal, Comentario, ReactiveFormsModule],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {

  comentariosService = inject(ComentariosService);
  miForm: FormGroup;
  publicacion = input.required<IPublicacion>();

  comentarios = signal<IComentario[]>([]);

  modo = input<'card' | 'modal'>('card');

  @Output() likeChanged = new EventEmitter<IPublicacion>();

  @Output() postDeleted = new EventEmitter<string>();

  animarLikes = false;
  showDeleteModal = false;

  hayMas = computed(() => this.comentarios().length < this.total());
  total = signal(0);
  offset = 0;
  readonly PAGE_SIZE = 5;

  constructor(
      private fb: FormBuilder,
      public publicacionesService: PublicacionesService,
      public authService: AuthStateService
    ) {
      this.miForm = this.fb.group({
        description: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(140)]],
      });
      effect(() => {
      this.cargarComentarios(this.publicacion()._id);
      });
    }

  get description() {
    return this.miForm.get('description');
  }

  async cargarComentarios(id: string) {
    // console.log('Cargando comentarios de', id);
    // this.comentariosService.find(id).subscribe({
    //   next: comentarios => {
    //     this.comentarios.set(comentarios);
    //   }
    // });
    //   const comentarios = await firstValueFrom(
    //   this.comentariosService.find(
    //     id,
    //     0,
    //     this.PAGE_SIZE
    //   )
    // );

    // this.comentarios.set(comentarios);

    // this.offset = comentarios.length;

    // this.hayMas.set(
    //   comentarios.length === this.PAGE_SIZE
    // );
    const respuesta = await firstValueFrom(
      this.comentariosService.find(
        id,
        0,
        this.PAGE_SIZE
      )
    );

    this.comentarios.set(respuesta.data);

    this.total.set(respuesta.total);

    this.offset = respuesta.data.length;
  }

  async cargarMasComentarios(id: string) {

    const respuesta = await firstValueFrom(this.comentariosService.find(id, this.offset, this.PAGE_SIZE));

    this.comentarios.update(actuales => [
      ...actuales,
      ...respuesta.data
    ]);

    this.offset += respuesta.data.length;
  }

  toggleLike() {
  if (this.authService.isLoggedIn()) {
    this.publicacionesService.toggleLike(this.publicacion()._id).subscribe(publiActualizada => {
      this.animarLikes = true;
      setTimeout(() => {this.animarLikes = false;}, 300);
      this.likeChanged.emit(publiActualizada);
      });
    }
  }

  deleteMyPost() {
    if (this.authService.isLoggedIn()) {
      this.publicacionesService.deletePost(this.publicacion()._id).subscribe({
        next: () => {this.postDeleted.emit(this.publicacion()._id);},
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  pedirConfirmacion() {
    this.showDeleteModal = true;
  }

  cerrarModal() {
    this.showDeleteModal = false;
  }

  confirmarDelete() {
    this.deleteMyPost();
    this.showDeleteModal = false;
  }

  actualizarComentario(commentActualizado: IComentario) {
  this.comentarios.update(comentarios =>
      comentarios.map(comment =>
        comment._id === commentActualizado._id
          ? commentActualizado
          : comment
      )
    );
    console.log(commentActualizado);
  }

  async accion(){
    if (this.miForm.invalid) {
      return;
    }

    const datos = this.miForm.getRawValue();
    
    const formData = new FormData();

    Object.entries(datos).forEach(([key, value]) => {
        formData.append(key, String(value));
    });

    try {
      await this.comentariosService.crearComentario(this.publicacion()._id, datos);
      this.miForm.reset();
      this.cargarComentarios(this.publicacion()._id);
    }
    catch(error) {
      console.log(error);
    }
    
  }

}
