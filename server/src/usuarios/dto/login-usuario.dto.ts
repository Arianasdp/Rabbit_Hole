import { IsEmail, MinLength } from 'class-validator';

export class LoginUsuarioDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
