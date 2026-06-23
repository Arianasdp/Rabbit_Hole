import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Usuario {
  @Prop({
    enum: ['usuario', 'administrador'],
    default: 'usuario',
  })
  profile: string;

  @Prop({ required: true, maxlength: 25 })
  name: string;

  @Prop({ required: true, maxlength: 25 })
  surname: string;

  @Prop({ required: true, unique: true, maxlength: 25 })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop()
  img: string;

  @Prop({ maxlength: 250 })
  description: string;
}

export const usuarioSchema = SchemaFactory.createForClass(Usuario);
