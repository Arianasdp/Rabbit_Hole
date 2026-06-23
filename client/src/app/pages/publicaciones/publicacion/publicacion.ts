import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { IPublicacion } from './publicacion.interface';
import { PublicacionesService } from '../publicaciones.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-publicacion',
  imports: [DatePipe],
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

  // toggleLike() {
  //   if (this.authService.isLoggedIn())
  //   {
  //     this.publicacionesService
  //     .toggleLike(this.publicacion()._id)
  //     .subscribe(publiActualizada => {
  //       this.likeChanged.emit(publiActualizada);
  //     });
  //   }
  // }
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

  // deleteMyPost() {
  //   if (this.authService.isLoggedIn()) {
  //     try {
  //       this.publicacionesService.deletePost(this.publicacion()._id);
  //     }catch (error: any) {

  //     console.log(error);
  //   }
      
  //   }
  // }
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

}
