import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'validAge' })
export class ValidAgeConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    const birthDate = new Date(value);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18 && age <= 100;
  }

  defaultMessage() {
    return 'La edad debe ser válida. Mayor de 18, menor de 100';
  }
}
