import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaRelativa',
})
export class FechaRelativaPipe implements PipeTransform {
  transform(fecha: string | Date): string {

    const fechaPublicacion = new Date(fecha);
    const ahora = new Date();

    const diferenciaMs =
      ahora.getTime() - fechaPublicacion.getTime();

    const minutos = Math.floor(diferenciaMs / (1000 * 60));
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
      return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    }

    if (horas > 0) {
      return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    }

    if (minutos > 0) {
      return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    }

    return 'Hace unos segundos';
  }
}
