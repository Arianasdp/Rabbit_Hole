import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Publicacion } from './publicacion.entity';

@Schema()
export class Comentario {
  @Prop({ type: SchemaTypes.ObjectId, ref: Publicacion.name, required: true })
  publicacion_id: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Usuario.name, required: true })
  author: Types.ObjectId;

  @Prop({ default: Date.now })
  created: Date;

  @Prop({ default: false })
  edited: boolean;
}

export const comentarioSchema = SchemaFactory.createForClass(Comentario);
