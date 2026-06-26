import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
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

  showSessionModal = signal(false);

  constructor() {
    console.log('TOKEN en constructor: ', this.getToken());
    const payload = this.getPayload();
    console.log('payload en constructor: ', payload);

    if (payload) {
      this.usuario.set(payload);
      console.log(this.usuario);
      this.restaurarSesion();
    }
  }

  async restaurarSesion() {
    const token = this.getToken();

    if (!token) {
      return;
    }

    try {
      const user = await firstValueFrom(
        this.http.get<Usuario>(`${this.apiUrl}/auth/me`)
      );

      this.profile.set(user);
    } catch (error) {
      console.error('Error auth/me: ', error);
      localStorage.removeItem('token');
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
      const payload = jwtDecode<TokenPayload>(token);
      console.log('Payload OK en getpayload: ', payload);
      return payload;
    } catch (error) {
      console.log('Error decodificando en getpayload: ', error);
      return null;
    }
  }

  private async actualizarSesion(jwt: string) {

    this.setToken(jwt);

    const payload = this.getPayload();
    this.usuario.set(payload);

    const user = await firstValueFrom(
      this.http.get<Usuario>(`${this.apiUrl}/auth/me`)
    );

    this.profile.set(user);
  }

  iniciarTimer() {

    setTimeout(() => {
      this.showSessionModal.set(true);
    }, 10 * 60 * 1000);

  }

  async registro(datos: RegistroDto | FormData) {
    try {
      const respuesta = await firstValueFrom(
        this.http.post<{ jwt: string }>(
          `${this.apiUrl}/auth/registro`,
          datos
        )
      );

      await this.actualizarSesion(respuesta.jwt);
      this.iniciarTimer();

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

    await this.actualizarSesion(respuesta.jwt);
    this.iniciarTimer();

    return respuesta;
  }

  cerrarModalSesion() {
    this.showSessionModal.set(false);
  }

  async extenderSesion() {
    try {
      const respuesta = await firstValueFrom(
        this.http.post<{ jwt: string }>(
          `${this.apiUrl}/auth/refrescar`,
        {})
      );
    
      await this.actualizarSesion(respuesta.jwt);

      this.iniciarTimer();

      return respuesta;

    } catch (error: any) {
      console.log(error);

      throw error;
    }
  }

}
