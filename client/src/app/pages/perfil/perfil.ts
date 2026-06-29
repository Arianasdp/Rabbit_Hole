import { Component, inject, signal } from '@angular/core';
import { Publicacion } from '../publicaciones/publicacion/publicacion';
import { ModoCine } from '../../common/modo-cine/modo-cine';
import { DatePipe } from '@angular/common';
import { IPublicacion } from '../publicaciones/publicacion/publicacion.interface';
import { PublicacionesService } from '../publicaciones/publicaciones.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../../auth/interfaces/usuario';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-perfil',
  imports: [DatePipe, Publicacion, ModoCine],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private publicacionesService = inject(PublicacionesService);
  publicacionSeleccionada = signal<IPublicacion | null>(null);
  publicaciones = signal<IPublicacion[]>([]);
  user = signal<Usuario | null>(null);

  constructor(
  private route: ActivatedRoute,
  private authService: AuthService
) {}

  async ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      await this.loadUser(userId);
    }

    this.publicacionesService
      .find('', this.user()?.username, 0, 3)
      .subscribe({
        next: publicaciones => {
          this.publicaciones.set(publicaciones);
        }
      });
  }

  async loadUser(id: string) {
  const user = await this.authService.traerUser(id);
  this.user.set(user);
  }

  eliminarPublicacion(id: string) {
      this.publicaciones.update(publicaciones =>
        publicaciones.filter(publi => publi._id !== id)
      );
      this.cargarPublicaciones();
    }

  cargarPublicaciones() {
    this.publicacionesService
      .find('', this.user()?.username, 0, 3)
      .subscribe({
        next: publicaciones => {
          this.publicaciones.set(publicaciones);
        }
      });
  }

  actualizarPublicacion(publiActualizada: IPublicacion) {
  this.publicaciones.update(publicaciones =>
      publicaciones.map(publi =>
        publi._id === publiActualizada._id
          ? publiActualizada
          : publi
      )
    );
    console.log("user x publi actualizada: ", publiActualizada);
  }

  abrirModal(publicacion: IPublicacion) {
    console.log("entramos a abrir en user perfil");
    this.publicacionSeleccionada.set(publicacion);
    console.log("publicacion de user es: ", this.publicacionSeleccionada);
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.publicacionSeleccionada.set(null);
    document.body.style.overflow = 'auto';
  }
}
