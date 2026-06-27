import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from './interfaces/usuario';
import { RegistroDto } from './interfaces/registro.dto';
import { LoginDto } from './interfaces/login.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {

  private http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  registrar(datos: RegistroDto | FormData) {
    return this.http.post<{ jwt: string }>(`${this.apiUrl}/auth/registro`, datos);
  }

  loguear(datos: LoginDto) {
    return this.http.post<{ jwt: string }>(`${this.apiUrl}/auth/login`, datos);
  }

  refrescar() {
    return this.http.post<{ jwt: string }>(`${this.apiUrl}/auth/refrescar`, {});
  }

  traerme() {
    return this.http.get<Usuario>(`${this.apiUrl}/auth/me`);
  }

  autorizar() {
    return this.http.post<{ jwt: string }>(`${this.apiUrl}/auth/autorizar`, {});
  }
}
