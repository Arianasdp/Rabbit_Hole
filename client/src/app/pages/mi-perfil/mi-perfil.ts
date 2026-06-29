import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IPublicacion } from '../publicaciones/publicacion/publicacion.interface';
import { PublicacionesService } from '../publicaciones/publicaciones.service';
import { Publicacion } from '../publicaciones/publicacion/publicacion';
import { AuthStateService } from '../../auth/auth-state.service';
import { ModoCine } from '../../common/modo-cine/modo-cine';

@Component({
  selector: 'app-mi-perfil',
  imports: [DatePipe, Publicacion, ModoCine],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {

  private publicacionesService = inject(PublicacionesService);
  constructor(public authService: AuthStateService) {}
  publicacionSeleccionada = signal<IPublicacion | null>(null);
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

  actualizarPublicacion(publiActualizada: IPublicacion) {
  this.misPublicaciones.update(publicaciones =>
      publicaciones.map(publi =>
        publi._id === publiActualizada._id
          ? publiActualizada
          : publi
      )
    );
    console.log("mi publi actualizada: ", publiActualizada);
  }

  abrirModal(publicacion: IPublicacion) {
    console.log("entramos a abrir en mi perfil");
    this.publicacionSeleccionada.set(publicacion);
    console.log("publicacion es: ", this.publicacionSeleccionada);
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.publicacionSeleccionada.set(null);
    document.body.style.overflow = 'auto';
  }
}
