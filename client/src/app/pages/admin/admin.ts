import { Component, inject, signal } from '@angular/core';
import { Usuario } from '../../auth/interfaces/usuario';
import { AuthApiService } from '../../auth/auth-api.service';

@Component({
  selector: 'app-admin',
  imports: [],
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
}
