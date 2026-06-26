import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IPublicacion } from "./publicacion/publicacion.interface";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class PublicacionesService {

    authService = inject(AuthService);
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {} 

    publicaciones = signal<IPublicacion[]>([]);

    find(sort?: string, author?: string, offset = 0, limit = 10) {
        return this.http.get<IPublicacion[]>(`${this.apiUrl}/publicaciones`, {
        params: {
            sort: sort ?? '',
            author: author ?? '',
            offset,
            limit
        }
        });
    }

    findTodas(sort?: string, author?: string) {
        return this.http.get<IPublicacion[]>(`${this.apiUrl}/publicaciones/todas`, {
        params: {
            sort: sort ?? '',
            author: author ?? ''
        }
        });
    }

    cargarTodas(likes?: string, author?: string) {
        this.findTodas(likes, author).subscribe({
        next: publicaciones => {
            this.publicaciones.set(publicaciones);
        }
        });
    }

    cargar(likes?: string, author?: string) {
    this.find(likes, author).subscribe({
        next: publicaciones => {
            this.publicaciones.set(publicaciones);
        }
        });
    }

    toggleLike(id: string) {
    return this.http.patch<IPublicacion>(
        `${this.apiUrl}/publicaciones/${id}/toggle-like`,
        {}
    );
    }

    deletePost(id: string) {
        return this.http.delete<IPublicacion>(
            `${this.apiUrl}/publicaciones/${id}`,
            {}
        );
    }

    async crearPost(datos: FormData) {
        const nueva =  await firstValueFrom(this.http.post<IPublicacion>(`${this.apiUrl}/publicaciones`, datos));

        this.publicaciones.update(actuales => [
            nueva,
            ...actuales
        ]);
    }
}