import { IsString, Length } from 'class-validator';

export class CreateComentarioDto {
  @IsString()
  @Length(2, 140)
  description: string;
}
