import { IsString } from 'class-validator';

export class EditarComentarioDto {
  @IsString()
  description: string;
}
