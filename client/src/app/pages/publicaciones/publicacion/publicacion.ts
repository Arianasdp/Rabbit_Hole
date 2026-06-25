import { Component, EventEmitter, input, Output } from '@angular/core';
import { IPublicacion } from './publicacion.interface';
import { PublicacionesService } from '../publicaciones.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { ConfirmActionDirective } from '../../../directives/confirm-action.directive';
import { Modal } from '../../../common/modal/modal';

@Component({
  selector: 'app-publicacion',
  imports: [DatePipe, ConfirmActionDirective, Modal],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {

  constructor(
      public publicacionesService: PublicacionesService,
      public authService: AuthService
    ) { }

  publicacion = input.required<IPublicacion>();

  @Output() likeChanged = new EventEmitter<IPublicacion>();

  @Output() postDeleted = new EventEmitter<string>();

  animarLikes = false;

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

}
