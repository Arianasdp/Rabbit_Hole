import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { IPublicacion } from './publicacion.interface';
import { PublicacionesService } from '../publicaciones.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { Modal } from '../../../common/modal/modal';
import { ComentariosService } from '../comentarios.service';
import { Comentario } from "../comentario/comentario";
import { IComentario } from '../comentario/comentario.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  comentarios = this.comentariosService.comentarios;

  @Output() likeChanged = new EventEmitter<IPublicacion>();

  @Output() postDeleted = new EventEmitter<string>();

  animarLikes = false;

  constructor(
      private fb: FormBuilder,
      public publicacionesService: PublicacionesService,
      public authService: AuthService
    ) {
      this.miForm = this.fb.group({
        description: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(140)]],
      });
      effect(() => {
      this.comentariosService.cargar(this.publicacion()._id);
      });
    }

  ngOnInit() {
    this.comentariosService.cargar(this.publicacion()._id);
  }

  get description() {
    return this.miForm.get('description');
  }

  toggleLike() {
  if (this.authService.isLoggedIn()) {
      this.publicacionesService
        .toggleLike(this.publicacion()._id)
        .subscribe(publiActualizada => {

          this.animarLikes = true;

          setTimeout(() => {
            this.animarLikes = false;
          }, 300);

          this.likeChanged.emit(publiActualizada);
        });
    }
  }

  deleteMyPost() {
    if (this.authService.isLoggedIn()) {
      this.publicacionesService
        .deletePost(this.publicacion()._id)
        .subscribe({
          next: () => {
            this.postDeleted.emit(this.publicacion()._id);
          },
          error: (error) => {
            console.error(error);
          }
        });
    }
  }

  showDeleteModal = false;

  pedirConfirmacion() {
    this.showDeleteModal = true;
  }

  cerrarModal() {
    console.log('cerrar modal', this.showDeleteModal);
    this.showDeleteModal = false;
  }

  confirmarDelete() {
    console.log('antes', this.showDeleteModal);
    this.deleteMyPost();
    this.showDeleteModal = false;
    console.log('dsps', this.showDeleteModal);
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
    this.miForm.reset();
    console.log("probando front post comments");
  }

}
