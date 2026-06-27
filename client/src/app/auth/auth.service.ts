import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './interfaces/login.dto';
import { RegistroDto } from './interfaces/registro.dto';
import { Router } from '@angular/router';
import { AuthApiService } from './auth-api.service';
import { TokenService } from './token.service';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private authApi = inject(AuthApiService);
  private tokenService = inject(TokenService);
  private authState = inject(AuthStateService);
  private router = inject(Router);

  constructor() {
    console.log('TOKEN en constructor: ', this.tokenService.getToken());
    const payload = this.tokenService.getPayload();
    console.log('payload en constructor: ', payload);

    if (payload) {
      this.authState.usuario.set(payload);
      console.log(this.authState.usuario);
      this.restaurarSesion();
    }
  }

  async restaurarSesion() {
    const token = this.tokenService.getToken();

    if (!token) {
      return;
    }

    try {
      const user = await firstValueFrom(this.authApi.traerme());
      this.authState.profile.set(user);
    } catch (error) {
      console.error('Error auth/me: ', error);
      this.tokenService.removeToken();
    }
  }

  logout() {
    this.tokenService.removeToken();
    this.authState.usuario.set(null);
    this.authState.profile.set(null);
    this.router.navigateByUrl('/auth/login');
  }

  private async actualizarSesion(jwt: string) {

    this.tokenService.setToken(jwt);

    const payload = this.tokenService.getPayload();
    this.authState.usuario.set(payload);

    const user = await firstValueFrom(this.authApi.traerme());

    this.authState.profile.set(user);
  }

  iniciarTimer() {
    console.log('entramos a iniciar timer');
    setTimeout(() => {
      this.authState.showSessionModal.set(true);
    }, 10 * 60 * 1000);

  }

  async registro(datos: RegistroDto | FormData) {
    try {
      const respuesta = await firstValueFrom(
        this.authApi.registrar(datos));

      await this.actualizarSesion(respuesta.jwt);
      this.iniciarTimer();

      return respuesta;

    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async login(datos: LoginDto) {
    const respuesta = await firstValueFrom(this.authApi.loguear(datos));

    await this.actualizarSesion(respuesta.jwt);
    this.iniciarTimer();

    return respuesta;
  }

  cerrarModalSesion() {
    this.authState.showSessionModal.set(false);
  }

  async extenderSesion() {
    try {
      const respuesta = await firstValueFrom(this.authApi.refrescar());
    
      await this.actualizarSesion(respuesta.jwt);

      this.iniciarTimer();

      return respuesta;

    } catch (error: any) {
      console.log(error);

      throw error;
    }
  }

  async autenticarToken(): Promise<boolean> {
    try {

      await firstValueFrom(this.authApi.autorizar());
      return true;

    } catch {
      return false;
      }
  }
}
