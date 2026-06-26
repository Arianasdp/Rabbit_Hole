import { computed, Injectable, signal } from '@angular/core';
import { TokenPayload } from './interfaces/token-payload';
import { Usuario } from './interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  usuario = signal<TokenPayload | null>(null);

  profile = signal<Usuario | null>(null);

  isLoggedIn = computed(() => this.usuario() !== null);

  showSessionModal = signal(false);
}
