import { Component, signal } from '@angular/core';
import { Publicacion } from './publicacion/publicacion';
import { PublicacionesService } from './publicaciones.service';
import { IPublicacion } from './publicacion/publicacion.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-publicaciones',
  imports: [Publicacion, ReactiveFormsModule],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {

  publicaciones = signal<IPublicacion[]>([]);

  miForm: FormGroup;

  constructor(
    private publicacionesService: PublicacionesService, private fb: FormBuilder, public authService: AuthService
  ) {
    this.miForm = this.fb.group({
      title: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(140)]],
      img: [null]
    });
    console.log(this.publicaciones);
  }

  get title() {
    return this.miForm.get('title');
  }

  get description() {
    return this.miForm.get('description');
  }

  ngOnInit() {
    this.publicacionesService.find().subscribe({
      next: publicaciones => {
        this.publicaciones.set(publicaciones);
        console.log(publicaciones);
      },
      error: err => {
        console.error(err);
      }
    });
  }

  async accion() {
    if (this.miForm.invalid) {
      return;
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

  actualizarPublicacion(publiActualizada: IPublicacion) {
  this.publicaciones.update(publicaciones =>
      publicaciones.map(publi =>
        publi._id === publiActualizada._id
          ? publiActualizada
          : publi
      )
    );
  }

  eliminarPublicacion(id: string) {
    this.publicaciones.update(publicaciones =>
      publicaciones.filter(publi => publi._id !== id)
    );
  }
}
