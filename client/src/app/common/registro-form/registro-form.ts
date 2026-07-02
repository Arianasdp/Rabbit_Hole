import { Component, inject, input, output, signal } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { fechaNacimientoValidator } from '../../validators/fecha-nacimiento.validator';
import { passwordsMatchValidator } from '../../validators/password-match.validator';
import { Modal } from '../modal/modal';
import { Usuario } from '../../auth/interfaces/usuario';

@Component({
  selector: 'app-registro-form',
  imports: [RouterLink, ReactiveFormsModule, Modal],
  templateUrl: './registro-form.html',
  styleUrl: './registro-form.css',
})
export class RegistroForm {

  authService = inject(AuthService);
  miForm: FormGroup;
  mostrarRol = input(false);
  showRegistroModal = false;

  usuarioCreado = output<Usuario>();

  constructor(private fb: FormBuilder,
  private router: Router) {
    this.miForm = this.fb.group({
      profile: ['usuario'],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)]],
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      birthdate:  ['', [Validators.required, fechaNacimientoValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)]],
      repeatPassword: ['', Validators.required],
      description: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(140)]],
      img: [null, Validators.required]
    },
    {
      validators: passwordsMatchValidator
    });
  }

  get profile() {
    return this.miForm.get('profile');
  }

  get name() {
    return this.miForm.get('name');
  }

  get surname() {
    return this.miForm.get('surname');
  }

  get username() {
    return this.miForm.get('username');
  }

  get birthdate() {
    return this.miForm.get('birthdate');
  }
  
  get email() {
    return this.miForm.get('email');
  }

  get password() {
    return this.miForm.get('password');
  }

  get repeatPassword() {
    return this.miForm.get('repeatPassword');
  }

  get description() {
    return this.miForm.get('description');
  }

  registroError = signal<string | null>(null);
  
  async accion() {
    if (this.miForm.invalid) {
      return;
    }

    const { repeatPassword, ...datos } = this.miForm.getRawValue();

    const formData = new FormData();

    Object.entries(datos).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value != null) {
        formData.append(key, String(value));
      }
    });

    try {

      if(this.mostrarRol() === false){
        await this.authService.registro(formData);
        this.router.navigate(['/publicaciones']);
      }
      else {
        const usuario = await this.authService.registroAdmin(formData);
        this.usuarioCreado.emit(usuario);
        this.showRegistroModal = true;
        this.miForm.reset();
      }
      

    } catch (error: any) {

      this.registroError.set(error.error.message);

    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.miForm.patchValue({
        img: input.files[0]
      });
    }
  }

  cerrarModal() {
    this.showRegistroModal = false;
  }
}
