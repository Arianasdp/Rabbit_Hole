import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Modal } from "./common/modal/modal";
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AuthStateService } from './auth/auth-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Modal, ClickOutsideDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');

  authService = inject(AuthService);
  authState = inject(AuthStateService);

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log('toggle', this.menuOpen);
  }

  logout() {
    this.authService.logout();
    this.menuOpen = false;
  }

  cerrarDropdown() {
    this.menuOpen = false;
  }

  cancelar() {
    this.authService.cerrarModalSesion();
  }

  extender() {
    this.authService.extenderSesion();
    this.authService.cerrarModalSesion();
  }
}
