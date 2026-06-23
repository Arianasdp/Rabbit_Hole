import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fechaNacimientoValidator( control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
        return null;
    }

    const nacimiento = new Date(control.value);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (
        mes < 0 ||
        (mes === 0 && hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    if (edad < 18) {
        return { menorEdad: true };
    }

    if (edad > 100) {
        return { edadInvalida: true };
    }

    return null;
}