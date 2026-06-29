import { Component, computed, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Publicacion } from '../../pages/publicaciones/publicacion/publicacion';
import { IPublicacion } from '../../pages/publicaciones/publicacion/publicacion.interface';
import { Comentario } from '../../pages/publicaciones/comentario/comentario';
import { ComentariosService } from '../../pages/publicaciones/comentarios.service';
import { IComentario } from '../../pages/publicaciones/comentario/comentario.interface';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStateService } from '../../auth/auth-state.service';

@Component({
  selector: 'app-modo-cine',
  imports: [Publicacion, Comentario, ReactiveFormsModule],
  templateUrl: './modo-cine.html',
  styleUrl: './modo-cine.css',
})
export class ModoCine {

  @Input() publicacion!: IPublicacion;
  @Output() cerrar = new EventEmitter<void>();
  @Output() likeChanged = new EventEmitter<IPublicacion>();
  @Output() postDeleted = new EventEmitter<string>();

  comentariosService = inject(ComentariosService);
  comentarios = signal<IComentario[]>([]);
  miForm: FormGroup;

  hayMas = computed(() => this.comentarios().length < this.total());
  total = signal(0);
  offset = 0;
  readonly PAGE_SIZE = 5;

  constructor (private fb: FormBuilder, public authService: AuthStateService) {
    this.miForm = this.fb.group({
        description: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(140)]],
      });
  }

  ngOnInit() {
    this.cargarComentarios(this.publicacion._id);
  }

  onLikeChanged(publiActualizada: IPublicacion) {
    this.publicacion = publiActualizada;
    this.likeChanged.emit(publiActualizada);
  }

  get description() {
    return this.miForm.get('description');
  }

  async cargarComentarios(id: string) {
    try {
        const respuesta = await firstValueFrom(
            this.comentariosService.find(id, 0, this.PAGE_SIZE)
        );
        this.comentarios.set(respuesta.data);
        this.total.set(respuesta.total);
        this.offset = respuesta.data.length;
    } catch (error) {
        console.error('Error cargando comentarios:', error);
    }
  }

  async cargarMasComentarios(id: string) {

    const respuesta = await firstValueFrom(this.comentariosService.find(id, this.offset, this.PAGE_SIZE));

    this.comentarios.update(actuales => [
      ...actuales,
      ...respuesta.data
    ]);

    this.offset += respuesta.data.length;
  }

  actualizarComentario(commentActualizado: IComentario) {
  this.comentarios.update(comentarios =>
      comentarios.map(comment =>
        comment._id === commentActualizado._id
          ? commentActualizado
          : comment
      )
    );
    console.log(commentActualizado);
  }

  async accion(){
    if (this.miForm.invalid) {
      return;
    }

    const datos = this.miForm.getRawValue();
    
    const formData = new FormData();

    Object.entries(datos).forEach(([key, value]) => {
        formData.append(key, String(value));
    });

    try {
      await this.comentariosService.crearComentario(this.publicacion._id, datos);
      this.miForm.reset();
      this.cargarComentarios(this.publicacion._id);
    }
    catch(error) {
      console.log(error);
    }
    
  }

}
