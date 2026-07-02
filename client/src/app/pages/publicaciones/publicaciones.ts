import { Component, effect, inject, signal } from '@angular/core';
import { Publicacion } from './publicacion/publicacion';
import { PublicacionesService } from './publicaciones.service';
import { IPublicacion } from './publicacion/publicacion.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthStateService } from '../../auth/auth-state.service';
import { ModoCine } from "../../common/modo-cine/modo-cine";

@Component({
  selector: 'app-publicaciones',
  imports: [Publicacion, ReactiveFormsModule, ModoCine],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {

  sort = signal<'fecha' | 'likes'>('fecha');
  author = signal('');
  private authorSearch$ = new Subject<string>();
  publicacionesService = inject(PublicacionesService);
  publicacionSeleccionada = signal<IPublicacion | null>(null);
  publicaciones = this.publicacionesService.publicaciones;
  selectedFile: File | null = null;
  miForm: FormGroup;

  constructor(
    private fb: FormBuilder, public authService: AuthStateService
  ) {
    this.miForm = this.fb.group({
      title: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(140)]],
      img: [null]
    });
    console.log(this.publicaciones);
    effect(() => {
      console.log('EFECTO: ', this.sort(), this.author());
      this.publicacionesService.cargarTodas(this.sort(), this.author());
    });
    this.authorSearch$.pipe(debounceTime(400)).subscribe(valor => {
      this.author.set(valor);
    });
  }

  get title() {
    return this.miForm.get('title');
  }

  get description() {
    return this.miForm.get('description');
  }

  ngOnInit() {
    this.publicacionesService.cargar();
  }

  async accion() {
    if (this.miForm.invalid) {
      return;
    }

    const datos = this.miForm.getRawValue();
    
    const formData = new FormData();

    Object.entries(datos).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value != null) {
        formData.append(key, String(value));
      }
    });

    try {

      await this.publicacionesService.crearPost(formData);
      this.publicacionesService.cargar(this.sort());
      this.miForm.reset();
      console.log("publicación correctamente creada");

    } catch(error: any) {
      console.log(error);
    }
  }

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
    console.log(publiActualizada);
  }

  eliminarPublicacion(id: string) {
    this.publicaciones.update(publicaciones =>
      publicaciones.filter(publi => publi._id !== id)
    );

    if (this.publicacionSeleccionada()?._id === id) {
      this.cerrarModal();
    }
  }

  filtrarUsuario(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.authorSearch$.next(valor);
  }

  abrirModal(publicacion: IPublicacion) {
    this.publicacionSeleccionada.set(publicacion);
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.publicacionSeleccionada.set(null);
    document.body.style.overflow = 'auto';
  }
}
