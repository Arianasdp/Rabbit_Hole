import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncarTexto',
})
export class TruncarTextoPipe implements PipeTransform {
  transform(texto: string, longitud: number = 30): string {

    if (!texto) {
      return '';
    }

    if (texto.length <= longitud) {
      return texto;
    }

    return texto.substring(0, longitud) + '...';
  }
}
