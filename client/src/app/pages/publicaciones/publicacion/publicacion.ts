import { Component, EventEmitter, input, Output} from '@angular/core';
import { IPublicacion } from './publicacion.interface';
import { PublicacionesService } from '../publicaciones.service';
import { DatePipe } from '@angular/common';
import { Modal } from '../../../common/modal/modal';
import { AuthStateService } from '../../../auth/auth-state.service';

@Component({
  selector: 'app-publicacion',
  imports: [DatePipe, Modal],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {

  publicacion = input.required<IPublicacion>();

  modo = input<'card' | 'modo-cine'>('card');

  @Output() likeChanged = new EventEmitter<IPublicacion>();

  @Output() postDeleted = new EventEmitter<string>();

  @Output() abrir = new EventEmitter<IPublicacion>();

  animarLikes = false;
  showDeleteModal = false;

  constructor(
      public publicacionesService: PublicacionesService,
      public authService: AuthStateService
    ) {}

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

  abrirPublicacion() {
    console.log('click en publicación');
    this.abrir.emit(this.publicacion());
  }

}
