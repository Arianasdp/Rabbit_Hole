import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IPublicacion } from "./publicacion/publicacion.interface";

@Injectable({
    providedIn: 'root'
})
export class PublicacionesService {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {} 

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
}