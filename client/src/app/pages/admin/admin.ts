import { Component, inject, signal } from '@angular/core';
import { Usuario } from '../../auth/interfaces/usuario';
import { AuthApiService } from '../../auth/auth-api.service';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

  authService = inject(AuthApiService);
  usuarios = signal<Usuario[]>([]);

  ngOnInit() {
    this.listarUsers();
  }

  listarUsers() {
    this.authService.traerTodos().subscribe({
      next: users => {
          this.usuarios.set(users);
        }
    })
  }

  copiarId(id: string) {
    navigator.clipboard.writeText(id);
  }

  async toggleDeleted(usuario: Usuario) {
    try {
      const usuarioActualizado = await firstValueFrom(
        this.authService.toggleDeleted(usuario._id)
      );

      usuario.deleted = usuarioActualizado.deleted;
    } catch (error) {
      console.error(error);
    }
  }
}
