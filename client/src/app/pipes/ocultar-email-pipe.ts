import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ocultarEmail',
})
export class OcultarEmailPipe implements PipeTransform {
  transform(email?: string): string {

    if (!email) {
      return '';
    }

    const [usuario, dominio] = email.split('@');

    return `${usuario.substring(0, 3)}****@${dominio}`;
  }
}
