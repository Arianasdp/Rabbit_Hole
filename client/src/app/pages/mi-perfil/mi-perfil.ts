import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IPublicacion } from '../publicaciones/publicacion/publicacion.interface';
import { PublicacionesService } from '../publicaciones/publicaciones.service';
import { Publicacion } from '../publicaciones/publicacion/publicacion';
import { AuthStateService } from '../../auth/auth-state.service';

@Component({
  selector: 'app-mi-perfil',
  imports: [DatePipe, Publicacion],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {

  private publicacionesService = inject(PublicacionesService);
  
  constructor(public authService: AuthStateService) {}

  misPublicaciones = signal<IPublicacion[]>([]);

  ngOnInit() {
  const username = this.authService.usuario()?.username;

  if (!username) return;

  this.publicacionesService
    .find('', username, 0, 3)
    .subscribe({
      next: publicaciones => {
        this.misPublicaciones.set(publicaciones);
      }
    });
}

  eliminarPublicacion(id: string) {
      this.misPublicaciones.update(publicaciones =>
        publicaciones.filter(publi => publi._id !== id)
      );
      this.cargarMisPublicaciones();
    }

  cargarMisPublicaciones() {
    this.publicacionesService
      .find('', this.authService.usuario()?.username, 0, 3)
      .subscribe({
        next: publicaciones => {
          this.misPublicaciones.set(publicaciones);
        }
      });
  }
}
