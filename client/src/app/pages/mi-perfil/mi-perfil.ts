import { Component, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { DatePipe } from '@angular/common';
import { IPublicacion } from '../publicaciones/publicacion/publicacion.interface';
import { PublicacionesService } from '../publicaciones/publicaciones.service';
import { Publicacion } from '../publicaciones/publicacion/publicacion';

@Component({
  selector: 'app-mi-perfil',
  imports: [DatePipe, Publicacion],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {

  constructor(public authService: AuthService, private publicacionesService: PublicacionesService) {}

  misPublicaciones = signal<IPublicacion[]>([]);

  ngOnInit() {
    this.publicacionesService.find('', this.authService.profile()?.username, 0, 3).subscribe({
      next: publicaciones => {
        this.misPublicaciones.set(publicaciones);
        console.log(publicaciones);
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
