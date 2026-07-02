import { Injectable, signal } from '@angular/core';
import { IComentariosPorPeriodo, IComentariosPorPeriodoYPublicacion, ILikeEvent, ILoginEvent, IProfileVisit, IPublicacionesPorUsuario } from './admin.interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {} 

  publicacionesPorUsuario = signal<IPublicacionesPorUsuario[]>([]);
  comentariosPorPeriodo = signal<IComentariosPorPeriodo[]>([]);
  comentariosPorPublicacion = signal<IComentariosPorPeriodoYPublicacion[]>([]);

  traerPublicacionesPorUsuario(desde: string, hasta: string) {
    return this.http.get<IPublicacionesPorUsuario[]>(`${this.apiUrl}/estadisticas/publicaciones`, {
        params: {
            desde: desde,
            hasta: hasta
        }
        });
  }

  cargarPublicacionesPorUsuario(desde: string, hasta: string) {
    this.traerPublicacionesPorUsuario(desde, hasta).subscribe({
      next: datos => {
        console.log('DATOS', datos);
        this.publicacionesPorUsuario.set(datos)}
    });
  }

  traerComentariosPorPeriodo(desde: string, hasta: string) {
    return this.http.get<IComentariosPorPeriodo[]>(`${this.apiUrl}/estadisticas/comentarios`, {
        params: {
            desde: desde,
            hasta: hasta
        }
        });
  }

  cargarComentariosPorPeriodo(desde: string, hasta: string) {
    this.traerComentariosPorPeriodo(desde, hasta).subscribe({
      next: datos => this.comentariosPorPeriodo.set(datos)
    });
  }

  traerComentariosPorPeriodoYPublicaion(desde: string, hasta: string) {
    return this.http.get<IComentariosPorPeriodoYPublicacion[]>(`${this.apiUrl}/estadisticas/comentarios/publicacion`, {
        params: {
            desde: desde,
            hasta: hasta
        }
        });
  }

  cargarComentariosPorPeriodoYPublicaion(desde: string, hasta: string) {
    this.traerComentariosPorPeriodoYPublicaion(desde, hasta).subscribe({
      next: datos => this.comentariosPorPublicacion.set(datos)
    });
  }

  likesPorDia() {
    return this.http.get<ILikeEvent[]>(`${this.apiUrl}/estadisticas/likes`);
  }

  loguinPorUsuario() {
    return this.http.get<ILoginEvent[]>(`${this.apiUrl}/estadisticas/logins`);
  }

  visitasAMiPerfil() {
    console.log('visitas a mi perfil');
    return this.http.get<IProfileVisit[]>(`${this.apiUrl}/estadisticas/visitas`);
  }
}
