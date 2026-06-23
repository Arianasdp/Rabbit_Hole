import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Validate,
} from 'class-validator';
import { ValidAgeConstraint } from '../../validators/valid-age.validator';

export class CreateUsuarioDto {
  @IsOptional()
  @IsString()
  profile?: string;

  @IsString()
  @Length(3, 15)
  name: string;

  @IsString()
  @Length(2, 15)
  surname: string;

  @IsString()
  @Length(2, 15)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 15)
  password: string;

  @IsDateString()
  @Validate(ValidAgeConstraint)
  birthdate: string;

  // @IsString()
  // img: string;

  @IsString()
  @MaxLength(140)
  description: string;
}
