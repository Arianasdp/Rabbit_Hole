import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePublicacionDto {
  @IsString()
  @Length(2, 50)
  title: string;

  @IsOptional()
  @IsString()
  img?: string;

  @IsString()
  @Length(2, 140)
  description: string;
}
