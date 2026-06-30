import { Component, inject, signal } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  authService = inject(AuthService);

  miForm: FormGroup;

  constructor(private fb: FormBuilder,
  private router: Router) {
    this.miForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  
  get email() {
    return this.miForm.get('email');
  }

  get password() {
    return this.miForm.get('password');
  }

  loginError = signal<string | null>(null);

  async accion() {

    if (this.miForm.invalid) {
      return;
    }

    try {

      await this.authService.login(
        this.miForm.value
      );

      this.router.navigate(['/publicaciones']);

    } catch (error: any) {

      this.loginError.set(error.error?.message || 'Credenciales inválidas');

    }
  }

  cargarUsuario(user: any) {
    this.miForm.patchValue({
      email: user.email,
      password: user.password
    });
  }
}