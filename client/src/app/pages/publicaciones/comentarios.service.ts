import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { IComentario } from "./comentario/comentario.interface";
import { AuthService } from "../../auth/auth.service";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ComentariosService {

    authService = inject(AuthService);

    apiUrl = environment.apiUrl;
    // apiUrl = 'https://rabbit-hole-backend.onrender.com';

    constructor(private http: HttpClient) {} 

    find(id: string, offset = 0, limit = 10) {
        return this.http.get<IComentario[]>(`${this.apiUrl}/publicaciones/${id}/comentarios`, {
            params: {
                offset,
                limit
            }
            });
        }

    async crearComentario(id: string, datos: FormData) {
        await firstValueFrom(this.http.post<IComentario>(`${this.apiUrl}/publicaciones/${id}/comentarios`, datos));
    
        // this.comentarios.update(actuales => [
        //     nueva,
        //     ...actuales
        // ]);
    }

    async editarComentario(id_publicacion: string, id: string, datos: FormData): Promise<IComentario>  {
        console.log('id_publicacion en service:', id_publicacion);
        console.log('id comentario en service:', id);
        const url =
            `${this.apiUrl}/publicaciones/${id_publicacion}/comentarios/${id}`;

        console.log('URL final:', url);
        console.log("datos en formdata: ", datos);

        return await firstValueFrom(
            this.http.put<IComentario>(url, datos)
        );
    }
}