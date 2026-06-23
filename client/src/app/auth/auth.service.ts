import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './interfaces/login.dto';
import { RegistroDto } from './interfaces/registro.dto';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from './interfaces/token-payload';
import { Usuario } from './interfaces/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);

  router = inject(Router);

  apiUrl = environment.apiUrl;

  usuario = signal<TokenPayload | null>(null);

  profile = signal<Usuario | null>(null);

  isLoggedIn = computed(() => this.usuario() !== null);

  constructor() {
    const payload = this.getPayload();
    console.log(payload);

    if (payload) {
      this.usuario.set(payload);
      console.log(this.usuario);
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
    this.usuario.set(null);
    this.router.navigateByUrl('/auth/login');
  }

  getPayload(): TokenPayload | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  }

  // async registro(datos: RegistroDto) {
  //   const respuesta = await firstValueFrom(
  //     this.http.post<{ jwt: string }>(
  //       `${this.apiUrl}/auth/registro`,
  //       datos
  //     )
  //   );

  //   this.setToken(respuesta.jwt);

  //   const payload = this.getPayload();

  //   this.usuario.set(payload);

  //   return respuesta;
  // }
  async registro(datos: RegistroDto | FormData) {
    try {
      const respuesta = await firstValueFrom(
        this.http.post<{ jwt: string }>(
          `${this.apiUrl}/auth/registro`,
          datos
        )
      );

      this.setToken(respuesta.jwt);

      const payload = this.getPayload();

      this.usuario.set(payload);

      const user = await firstValueFrom(
      this.http.get<Usuario>(`${this.apiUrl}/auth/me`)
    );

    this.profile.set(user);

      return respuesta;

    } catch (error: any) {
      console.log(error);

      throw error;
    }
  }

  async login(datos: LoginDto) {
    const respuesta = await firstValueFrom(
      this.http.post<{ jwt: string }>(
        `${this.apiUrl}/auth/login`,
        datos
      )
    );

    this.setToken(respuesta.jwt);

    const payload = this.getPayload();

    this.usuario.set(payload);

    const user = await firstValueFrom(
      this.http.get<Usuario>(`${this.apiUrl}/auth/me`)
    );

    this.profile.set(user);

    console.log("profile: ", this.profile);

    return respuesta;
  }

}
