import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Schema()
export class Publicacion {
  @Prop()
  title: string;

  @Prop()
  img: string;

  @Prop()
  description: string;

  @Prop({ default: [] })
  likes: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: Usuario.name, required: true })
  author: Types.ObjectId;

  @Prop({ default: Date.now })
  created: Date;

  @Prop({ default: false })
  deleted: boolean;
}

export const publicacionSchema = SchemaFactory.createForClass(Publicacion);
