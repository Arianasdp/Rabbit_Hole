import { Component, EventEmitter, inject, input, Output} from '@angular/core';
import { IPublicacion } from './publicacion.interface';
import { PublicacionesService } from '../publicaciones.service';
import { Modal } from '../../../common/modal/modal';
import { AuthStateService } from '../../../auth/auth-state.service';
import { Router } from '@angular/router';
import { FechaRelativaPipe } from '../../../pipes/fecha-relativa-pipe';
import { TruncarTextoPipe } from '../../../pipes/truncar-texto-pipe';
import { Popularidad } from '../../../directives/popularidad';
import { HoverUsuario } from '../../../directives/hover-usuario';

@Component({
  selector: 'app-publicacion',
  imports: [Modal, FechaRelativaPipe, TruncarTextoPipe, Popularidad, HoverUsuario],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {

  publicacion = input.required<IPublicacion>();

  modo = input<'card' | 'modo-cine'>('card');

  router = inject(Router);

  @Output() likeChanged = new EventEmitter<IPublicacion>();

  @Output() postDeleted = new EventEmitter<string>();

  @Output() abrir = new EventEmitter<IPublicacion>();

  animarLikes = false;
  showDeleteModal = false;
  mostrarCompleto = false;

  constructor(
      public publicacionesService: PublicacionesService,
      public authService: AuthStateService
    ) {}

  toggleLike() {
    console.log('CLICK en togglelike');
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

  irAPerfil(id: string) {
    if(id !== this.authService.profile()?._id) {
      this.router.navigate(['/perfil', id]);
    } else {
      this.router.navigate(['/mi-perfil']);
    }
    
  }

}
