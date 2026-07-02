import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit, effect} from '@angular/core';
import { Usuario } from '../../auth/interfaces/usuario';
import { AuthApiService } from '../../auth/auth-api.service';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { RegistroForm } from '../../common/registro-form/registro-form';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { AdminService } from './admin-service';
import { IComentariosPorPeriodo, IComentariosPorPeriodoYPublicacion, ILikeEvent, ILoginEvent, IProfileVisit, IPublicacionesPorUsuario } from './admin.interfaces';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  imports: [DatePipe, RegistroForm, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

  authService = inject(AuthApiService);
  usuarios = signal<Usuario[]>([]);
  @ViewChild('publicacionesChart')
  publicacionesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoComentarios')
  graficoComentarios!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoComentariosPublicacion')
  graficoComentariosPublicacion!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoLogins')
  graficoLogins!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoVisitas')
  graficoVisitas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoLikes')
  graficoLikes!: ElementRef<HTMLCanvasElement>;

  private chartPublicacion?: Chart;
  private chartComentariosPublicacion?: Chart;
  private chartVisitas?: Chart;
  private chartLogins?: Chart;
  private chartComentarios?: Chart;
  private chartLikes?: Chart;
  filtroForm: FormGroup;

  constructor(private fb: FormBuilder,  private adminService: AdminService) {
  this.filtroForm = this.fb.group({
    desde: [''],
    hasta: ['']
  });
  effect(() => {
      const datos =
        this.adminService.publicacionesPorUsuario();

      if (datos.length) {
          this.crearGraficoPublicaciones(datos);
      }
      else {
        this.chartPublicacion?.destroy();
        this.chartPublicacion = undefined;
      }
      
      const datosComentarios = this.adminService.comentariosPorPeriodo();

      if (datosComentarios.length) {
          this.crearGraficoComentarios(datosComentarios);
        }
      else {
        this.chartComentarios?.destroy();
        this.chartComentarios = undefined;
      }

      const datosComentariosPublicicacion = this.adminService.comentariosPorPublicacion();

      if (datosComentariosPublicicacion.length) {
        this.crearGraficoComentariosPublicacion(datosComentariosPublicicacion);
      }
      else {
        this.chartComentariosPublicacion?.destroy();
        this.chartComentariosPublicacion = undefined;
      }
    });

  }

  get desde() {
    return this.filtroForm.get('desde');
  }

  get hasta() {
    return this.filtroForm.get('hasta');
  }

  buscar() {

    const desde = this.desde?.value;
    const hasta = this.hasta?.value;

    this.adminService.publicacionesPorUsuario.set([]);
    this.adminService.comentariosPorPeriodo.set([]);
    this.adminService.comentariosPorPublicacion.set([]);

    this.adminService.cargarPublicacionesPorUsuario(desde, hasta);

    this.adminService.cargarComentariosPorPeriodo(desde, hasta);

    this.adminService.cargarComentariosPorPeriodoYPublicaion(desde, hasta);

  }

  ngAfterViewInit() {
    console.log(this.publicacionesChart);
  }

  ngOnInit() {
    const hoy = new Date();

    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    this.filtroForm.patchValue({
      desde: hace30Dias.toLocaleDateString('sv-SE'),
      hasta: hoy.toLocaleDateString('sv-SE'),
    });

    this.buscar();
    this.cargarGraficoLogins();
    this.cargarGraficoLikes();
    this.cargarGraficoVisitas();
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

  agregarUsuario(usuario: Usuario) {
    this.usuarios.update(usuarios => {
      return [...usuarios, usuario];
    });
  }

  crearGraficoPublicaciones(datos: IPublicacionesPorUsuario[]) {
    console.log('grafico publicaciones', datos);
    if (this.chartPublicacion) {
      this.chartPublicacion.destroy();
    }

    this.chartPublicacion = new Chart(
      this.publicacionesChart.nativeElement,
      {
        type: 'bar',

        data: {
          labels: datos.map(x => x.usuario),

          datasets: [
            {
              label: 'Publicaciones',
              data: datos.map(x => x.cantidad),
              backgroundColor: '#4F46E5' 
            }
          ]
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
              title: {
                display: true,
                text: 'Publicaciones por usuario',
                color: 'white'
              }
          },

          scales: {
            y: {
              ticks: {
                color: 'white'
              }
            },
            x: {
              ticks: {
                color: 'white'
              }
            }
        }
      }
    });
  }

  crearGraficoComentarios(datos: IComentariosPorPeriodo[]) {

    if (this.chartComentarios) {
      this.chartComentarios.destroy();
    }

    this.chartComentarios = new Chart(
      this.graficoComentarios.nativeElement,
      {
        type: 'radar',

        data: {
          labels: datos.map(x => x.fecha),

          datasets: [{
            label: 'Comentarios',
            data: datos.map(x => x.cantidad),
            backgroundColor: '#25243620',
            borderColor: '#6a6792'
          }]
        },
        options: {

          plugins: {
              title: {
                display: true,
                text: 'Comentarios por período',
                color: 'white'
              }
          }
        }
    });
  }

  crearGraficoComentariosPublicacion(datos: IComentariosPorPeriodoYPublicacion[]) {

    if (this.chartComentariosPublicacion) {
      this.chartComentariosPublicacion.destroy();
    }

    this.chartComentariosPublicacion = new Chart(
      this.graficoComentariosPublicacion.nativeElement,
      {
      type: 'bar',

      data: {
        labels: datos.map(x => x.publicacion),

        datasets: [
          {
            label: 'Comentarios',
            data: datos.map(x => x.cantidad),

            backgroundColor: '#8B5CF6',
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        indexAxis: 'y',

        plugins: {
          title: {
            display: true,
            text: 'Comentarios por publicación',
            color: 'white'
          }
        }
      }
    });
  }

  cargarGraficoLogins() {
    this.adminService.loguinPorUsuario().subscribe({
      next: datos => {
        this.crearGraficoLogins(datos);
      }
    });
  }

  crearGraficoLogins(datos: ILoginEvent[]) {

    this.chartLogins = new Chart(
      this.graficoLogins.nativeElement,
      {
        type: 'doughnut',

        data: {
          labels: datos.map(x => x.username),

          datasets: [{
            data: datos.map(x => x.cantidad),

            backgroundColor: [
              '#8B5CF6',
              '#ba60cc',
              '#0b5df5',
              '#8bd1e6',
              '#554875'
            ]
          }]
        },
        options: {

          plugins: {
              title: {
                display: true,
                text: 'Logins por usuario',
                color: 'white'
              }
          }
        }
      }
    );
  }

  cargarGraficoLikes() {
    this.adminService.likesPorDia().subscribe({
      next: datos => {
        this.crearGraficoLikes(datos);
      }
    });
  }

  crearGraficoLikes(datos: ILikeEvent[]) {

    this.chartLikes = new Chart(
      this.graficoLikes.nativeElement,
      {
        type: 'line',

        data: {
          labels: datos.map(x => x._id),

          datasets: [{
            label: 'Likes',

            data: datos.map(x => x.cantidad),

            borderColor: '#b41c9b',

            fill: false,

            tension: 0.3
          }]
        },

        options: {
          plugins: {
              title: {
                display: true,
                text: 'Likes por día',
                color: 'white'
              }
          },

          scales: {
              y: {
                ticks: {
                  color: 'white'
                }
              },
              x: {
                ticks: {
                  color: 'white'
                }
              }
          }
        }
      }
    );
  }

  cargarGraficoVisitas() {
    this.adminService.visitasAMiPerfil().subscribe({
      next: datos => {
        this.crearGraficoVisitas(datos);
      }
    });
  }

  crearGraficoVisitas(datos: IProfileVisit[]) {
    console.log('grafico visitas', datos);
    this.chartVisitas = new Chart(
      this.graficoVisitas.nativeElement,
      {
        type: 'pie',

        data: {
          labels: datos.map(x => x.username),

          datasets: [{
            data: datos.map(x => x.cantidad),

            backgroundColor: [
              '#8B5CF6',
              '#ba60cc',
              '#0b5df5',
              '#8bd1e6',
              '#554875',
              '#EC4899'
            ]
          }]
        },

        options: {
          plugins: {
              title: {
                display: true,
                text: 'Visitas a mi perfil',
                color: 'white'
              }
          },
        }
      }
    );
  }
}
